import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import nc from "next-connect";
import { upload, uploadImagemCosmic } from "../../services/uploadImagemCosmic";
import { conectarMongoDB } from "../../middlewares/conectaMongoDB";
import { validarJWT } from "../../middlewares/validarTokenJWT";
import { PublicacaoModel } from "../../models/PublicacaoModel";
import { UsuarioModel } from "../../models/UsuarioModel";

const handler = nc()
  .use(upload.single("file"))
  .post(async (req: any, res: NextApiResponse<RespostaPadraoMsg>) => {
    try {
      const { userId } = req.query;
      const usuario = await UsuarioModel.findById(userId);
      if (!usuario) {
        return res.status(400).json({ erro: "Usuario nao encontrado" });
      }

      if (!req || !req.body) {
        return res
          .status(400)
          .json({ erro: "Parametros de entrada não informados" });
      }
      const { descricao, file } = req?.body;

      if (!descricao || descricao.length < 2) {
        return res.status(400).json({ erro: "Descricao invalida" });
      }

      if (!req.file || !req.file.originalname) {
        return res.status(400).json({ erro: "Arquivo obrigatorio" });
      }

      const image = await uploadImagemCosmic(req);
      const publicacao = {
        idUsuario: usuario._id,
        descricao,
        foto: image.media.url,
        data: new Date(),
      };

      await PublicacaoModel.create(publicacao);

      return res.status(200).json({ msg: "Publicacao criada com sucesso" });
    } catch (e) {
      return res.status(400).json({ erro: "Erro ao cadastrar publicacao" });
    }
  });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default validarJWT(conectarMongoDB(handler));
