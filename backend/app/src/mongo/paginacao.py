from math import ceil
from bson import ObjectId
from core.database import db

async def contar(colecao, base: list) -> int:
    resultado = await colecao.aggregate(base + [{'$count': 'total'}], allowDiskUse=True).to_list(length=1)
    return resultado[0]['total'] if resultado else 0

def calcular_pagina(total: int, pagina: int, limite: int) -> tuple[int, int]:
    total_paginas = max(1, ceil(total / limite))
    return min(pagina, total_paginas), total_paginas

async def paginar(colecao, base: list, ordem: dict, pagina: int, limite: int, apos_pagina: list | None = None) -> tuple[list, int, int, int]:
    total = await contar(colecao, base)
    pagina, total_paginas = calcular_pagina(total, pagina, limite)
    etapas = base + [{'$sort': ordem}, {'$skip': (pagina - 1) * limite}, {'$limit': limite}] + (apos_pagina or [])
    itens = await colecao.aggregate(etapas, allowDiskUse=True).to_list(length=limite)
    return itens, total, pagina, total_paginas

async def listar_todos(colecao, base: list, ordem: dict, apos: list | None = None) -> list:
    etapas = base + [{'$sort': ordem}] + (apos or [])
    return await colecao.aggregate(etapas, allowDiskUse=True).to_list(length=None)

def filtro_cadastro(inicio, fim) -> dict | None:
    if inicio is None and fim is None:
        return None
    faixa, faixa_id = {}, {}
    if inicio is not None:
        faixa['$gte'] = inicio
        faixa_id['$gte'] = ObjectId.from_datetime(inicio)
    if fim is not None:
        faixa['$lt'] = fim
        faixa_id['$lt'] = ObjectId.from_datetime(fim)
    return {'$or': [{'data_criacao': faixa}, {'data_criacao': {'$exists': False}, '_id': faixa_id}]}

def campo_data(campo: str = 'data_criacao') -> dict:
    return {'$ifNull': [f'${campo}', {'$toDate': '$_id'}]}
