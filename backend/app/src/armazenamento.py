import re
from io import BytesIO
from pathlib import Path
from fastapi import HTTPException, UploadFile, status
from PIL import Image, ImageOps, UnidentifiedImageError

PASTA_FOTOS = Path(__file__).resolve().parent / "fotos"
PAPEIS_COM_FOTO = ("cliente", "prestador")
TAMANHO_MAXIMO_BYTES = 2 * 1024 * 1024
LADO_MAXIMO_PX = 512
PADRAO_ID = re.compile(r"^[0-9a-f]{24}$")

def _erro_foto(detalhe: str, codigo: int = status.HTTP_400_BAD_REQUEST):
    return HTTPException(status_code=codigo, detail=detalhe)

async def preparar_foto(foto: UploadFile | None) -> bytes | None:
    if foto is None or not foto.filename:
        return None
    conteudo = await foto.read(TAMANHO_MAXIMO_BYTES + 1)
    if len(conteudo) > TAMANHO_MAXIMO_BYTES:
        raise _erro_foto("A foto deve ter no máximo 2 MB.", status.HTTP_413_REQUEST_ENTITY_TOO_LARGE)
    try:
        Image.open(BytesIO(conteudo)).verify()
        imagem = ImageOps.exif_transpose(Image.open(BytesIO(conteudo))).convert("RGB")
    except (UnidentifiedImageError, OSError, ValueError, Image.DecompressionBombError):
        raise _erro_foto("Envie uma imagem válida (JPG, PNG ou WEBP).")
    imagem.thumbnail((LADO_MAXIMO_PX, LADO_MAXIMO_PX))
    saida = BytesIO()
    imagem.save(saida, format="JPEG", quality=85)
    return saida.getvalue()

def _caminho(papel: str, id_usuario: str) -> Path | None:
    if papel not in PAPEIS_COM_FOTO or not PADRAO_ID.match(id_usuario):
        return None
    return PASTA_FOTOS / papel / f"{id_usuario}.jpg"

def salvar_foto(papel: str, id_usuario: str, conteudo: bytes):
    caminho = _caminho(papel, id_usuario)
    if caminho is None:
        raise _erro_foto("Perfil inválido para foto.")
    caminho.parent.mkdir(parents=True, exist_ok=True)
    caminho.write_bytes(conteudo)

def caminho_foto(papel: str, id_usuario: str) -> Path | None:
    caminho = _caminho(papel, id_usuario)
    if caminho is None or not caminho.is_file():
        return None
    return caminho

def remover_foto(papel: str, id_usuario: str):
    caminho = _caminho(papel, id_usuario)
    if caminho is not None:
        caminho.unlink(missing_ok=True)
