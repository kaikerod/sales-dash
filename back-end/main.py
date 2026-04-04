from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import get_db, engine, Base
from models.sales import Sale
from schemas.sales import SaleCreate, SaleUpdate, SaleResponse
from typing import List

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