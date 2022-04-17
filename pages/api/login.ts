import type { NextApiRequest, NextApiResponse } from "next";
import { conectarMongoDB } from '../../middlewares/conectaMongoDB'
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg'

const endpointLongin = (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg>
) => {
  if(req.method === 'POST'){
    const {login, senha} = req.body;

    if(login === 'vitu123' &&
    senha === 'senha123'
    ) {
      return res.status(200).json({msg: 'Usuario autenticado com sucesso'})
    }
    return res.status(405).json({erro: 'Usuario ou senha nao encontrados'})
  }
  return res.status(405).json({erro: 'Metodo informado nao e valido'})
}

export default conectarMongoDB(endpointLongin);