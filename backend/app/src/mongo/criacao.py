from validate_docbr import CPF
import httpx
from core.security import gerar_senha_hash
from core.database import cliente_col,prestador_col,admin_col
#from motor.motor_asyncio import AsyncIOMotorClient
#from bson import ObjectId
#import asyncio

async def adicionar_admin(nome: str, email: str, senha: str):
    novo_admin = {'nome': nome, 'email': email, 'senha': gerar_senha_hash(senha)}
    result = await admin_col.insert_one(novo_admin)
    return {'Sucesso': f'Novo admin adicionado com o id: {result.inserted_id}'}

async def pegar_dados_cep(cep: str):
    cep_limpo = "".join(filter(str.isdigit, cep))
    if len(cep_limpo) != 8:
        return {"erro": "O CEP deve conter exatamente 8 números."}
    url_viacep = f"https://viacep.com.br/ws/{cep_limpo}/json/"
    url_brasilapi = f"https://brasilapi.com.br/api/cep/v2/{cep_limpo}"
    async with httpx.AsyncClient(timeout=5.0) as client:
        try:
            response = await client.get(url_viacep)
        except httpx.RequestError:
            return {"erro": "Falha de conexão com o serviço de CEP."}

        if response.status_code != 200:
            return {"erro": f"Erro na API ViaCEP. Status: {response.status_code}"}

        dados = response.json()
        if dados.get("erro") in [True, "true"]:
            return {"erro": "CEP não encontrado na base de dados."}
        endereco = {
                "rua": dados.get("logradouro"),
                "cidade": dados.get("localidade"),
                "estado": dados.get("uf"),
                "lat": None,
                "lon": None
        }
        try:
            resp_coords = await client.get(url_brasilapi)
            resp_coords.raise_for_status()
            dados_coords = resp_coords.json()
            coords = dados_coords.get("location", {}).get("coordinates", {})
            if coords.get("latitude") and coords.get("longitude"):
                endereco["lat"] = float(coords["latitude"])
                endereco["lon"] = float(coords["longitude"])
        except (httpx.HTTPStatusError, httpx.RequestError, ValueError, KeyError):
            pass
        return endereco

async def validar_cpf(cpf_user):
    cpf = CPF()
    conversao = "".join([c for c in cpf_user if c.isdigit()])
    return cpf.validate(conversao)

async def adicionar_cliente(nome: str, email: str, idade: int, cep: str, cpf: str,body: str,senha: str):
    validacao_cpf_cliente = await validar_cpf(cpf)
    if validacao_cpf_cliente != True:
        return {'Erro': 'CPF não validado, insira novamente.'}
    resultado_cep  = await pegar_dados_cep(cep)
    if "erro" in resultado_cep:
        return {"Erro": resultado_cep["erro"]}
    cliente_add = {'nome': nome, 'email': email, 'idade': idade, 'Endereco': [
                {'cep': cep, 'rua': resultado_cep ['rua'], 'cidade': resultado_cep ['cidade'], 'estado': resultado_cep['estado'], 'latitude': resultado_cep['lat'], 'longitude': resultado_cep['lon']}
            ], 'cpf': cpf, 'contexto': body, 'senha': gerar_senha_hash(senha)}
    insercao = await cliente_col.insert_one(cliente_add)
    return {'Sucesso': f'Cliente adicionado com o id: {insercao.inserted_id}'}

async def adicionar_prestador(nome: str, email: str, idade: int, cep: str, cpf: str,body: str,valor_inicio: float,valor_final: float, senha: str,certificacoes: list[str] | None = None,idiomas: list[str] | None = None):
    validacao_cpf_prestador = await validar_cpf(cpf)
    if validacao_cpf_prestador != True:
        return {'Erro': 'CPF não validado, insira novamente.'}
    resultado_cep  = await pegar_dados_cep(cep)
    if "erro" in resultado_cep:
        return {"Erro": resultado_cep["erro"]}
    prestador_add = {'nome': nome, 'email': email, 'idade': idade, 'Endereco': [
                {'cep': cep, 'rua': resultado_cep ['rua'], 'cidade': resultado_cep ['cidade'], 'estado': resultado_cep['estado'], 'latitude': resultado_cep['lat'], 'longitude': resultado_cep['lon']}
            ], 'cpf': cpf, 'informacoes': body,'de_valor': valor_inicio, 'ate_valor': valor_final,'idiomas': idiomas ,'certificados': certificacoes,'senha': gerar_senha_hash(senha)}
    insercao = await prestador_col.insert_one(prestador_add)
    return {'Sucesso': f'Prestador adicionado com o id: {insercao.inserted_id}'}

'''
if __name__ == '__main__':
    asyncio.run()
'''