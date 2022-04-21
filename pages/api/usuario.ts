import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next'
import type { } from '../../types/RespostaPadraoMsg'
import { validarJWT } from '../../middlewares/validarTokenJWT'

const usuarioEndPoint = (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
  return res.status(200).json('Usuario autenticado com sucesso');
}

export default validarJWT(usuarioEndPoint);