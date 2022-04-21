import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { validarJWT } from "../../middlewares/validarTokenJWT";
import { conectarMongoDB } from "../../middlewares/conectaMongoDB";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import { UsuarioModel } from "../../models/UsuarioModel";

const usuarioEndPoint = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg | any>
) => {
  try {
    const { userId } = req?.query;
    const usuario = await UsuarioModel.findById(userId)
    usuario.senha = null;
    return res.status(200).json(usuario);
  } catch (e) {
    console.log(e);
  }
  res.status(400).json({ erro: "Nao foi possivel obter dados do usuario" });
};

export default validarJWT(conectarMongoDB(usuarioEndPoint));
