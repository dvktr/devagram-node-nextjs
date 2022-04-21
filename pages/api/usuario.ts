import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next'
import { validarJWT } from '../../middlewares/validarTokenJWT'

const usuarioEndPoint = (req: NextApiRequest, res: NextApiResponse) => {
  return res.status(200).json('Usuario autenticado com sucesso');
}

export default validarJWT(usuarioEndPoint);