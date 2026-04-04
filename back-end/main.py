from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import get_db, engine, Base
from models.sales import Sale
from schemas.sales import SaleCreate, SaleUpdate, SaleResponse
from typing import List
from sqlalchemy import func, extract
from sqlalchemy import text

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Sales Dashboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/sales", response_model=SaleResponse, status_code=201)
def create_sale(sale: SaleCreate, db: Session = Depends(get_db)):
    total = sale.quantity * sale.unit_price
    db_sale = Sale(**sale.model_dump(), total=total)
    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)
    return db_sale

@app.get("/sales", response_model=List[SaleResponse])
def get_sales(db: Session = Depends(get_db)):
    return db.query(Sale).all()

@app.get("/sales/{sale_id}", response_model=SaleResponse)
def get_sale(sale_id: int, db: Session = Depends(get_db)):
    sale = db.query(Sale).filter(Sale.id == sale_id).first()
    if not sale:
        raise HTTPException(status_code=404, detail="Venda não encontrada")
    return sale

@app.put("/sales/{sale_id}", response_model=SaleResponse)
def update_sale(sale_id: int, data: SaleUpdate, db: Session = Depends(get_db)):
    sale = db.query(Sale).filter(Sale.id == sale_id).first()
    if not sale:
        raise HTTPException(status_code=404, detail="Venda não encontrada")

    updated_fields = data.model_dump(exclude_unset=True)
    for field, value in updated_fields.items():
        setattr(sale, field, value)

    sale.total = sale.quantity * sale.unit_price

    db.commit()
    db.refresh(sale)
    return sale

@app.delete("/sales/{sale_id}", status_code=204)
def delete_sale(sale_id: int, db: Session = Depends(get_db)):
    sale = db.query(Sale).filter(Sale.id == sale_id).first()
    if not sale:
        raise HTTPException(status_code=404, detail="Venda não encontrada")
    db.delete(sale)
    db.commit()

@app.get("/analytics/kpis")
def get_kpis(db: Session = Depends(get_db)):
    result = db.query(
        func.count(Sale.id).label("total_sales"),
        func.sum(Sale.total).label("total_revenue"),
        func.avg(Sale.unit_price).label("avg_ticket")
    ).first()

    return {
        "total_sales": result.total_sales or 0,
        "total_revenue": round(result.total_revenue or 0, 2),
        "avg_ticket": round(result.avg_ticket or 0, 2)
    }

@app.get("/analytics/sales-by-month")
def get_sales_by_month(db: Session = Depends(get_db)):
    results = db.query(
        extract("year", Sale.sale_date).label("year"),
        extract("month", Sale.sale_date).label("month"),
        func.sum(Sale.total).label("revenue")
    ).group_by("year", "month").order_by("year", "month").all()

    return [
        {
            "label": f"{int(r.month):02d}/{int(r.year)}",
            "revenue": round(r.revenue, 2)
        }
        for r in results
    ]

@app.get("/analytics/sales-by-category")
def get_sales_by_category(db: Session = Depends(get_db)):
    results = db.query(
        Sale.category,
        func.sum(Sale.total).label("revenue")
    ).group_by(Sale.category).order_by(func.sum(Sale.total).desc()).all()

    return [
        {"category": r.category, "revenue": round(r.revenue, 2)}
        for r in results
    ]

@app.delete("/sales/reset/all", status_code=204)
def reset_sales(db: Session = Depends(get_db)):
    db.execute(text("TRUNCATE TABLE sales RESTART IDENTITY"))
    db.commit()