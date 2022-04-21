import { NextApiRequest, NextApiResponse } from 'next';
import type { CadastroRequisicao } from '../../types/CadastroRequisicao';
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import { UsuarioModel } from '../../models/UsuarioModel'
import { conectarMongoDB } from '../../middlewares/conectaMongoDB'
import md5 from 'md5'
import { upload, uploadImagemCosmic } from '../../services/uploadImagemCosmic'
import nc from 'next-connect';

const handler = nc()
  .use(upload.single('file'))
  .post(async (
    req: NextApiRequest,
    res: NextApiResponse<RespostaPadraoMsg>
  ) => {
    try {
      const usuario = req.body as CadastroRequisicao;

      if (!usuario.nome || usuario.nome.length < 2) {
        return res.status(400).json({ erro: 'nome invalido' })
      }

      if (!usuario.email || usuario.email.length < 2 || !usuario.email.includes('@') || !usuario.email.includes('.')) {
        return res.status(400).json({ erro: 'email invalido' })
      }

      if (!usuario.senha || usuario.senha.length < 3) {
        return res.status(400).json({ erro: 'senha invalido' })
      }

      //validacao de duplucidade de email
      const usuariComMesmoEmail = await UsuarioModel.find({ email: usuario.email })
      if (usuariComMesmoEmail && usuariComMesmoEmail.length > 0) {
        return res.status(400).json({ erro: 'email ja cadastrado' })
      }

      //enviar a imagem do multer para o cosmic
      const image = await uploadImagemCosmic(req);

      //salvar usuario
      const usuarioAoSerSalvo = {
        nome: usuario.nome,
        email: usuario.email,
        senha: md5(usuario.senha),
        avatar: image?.media?.url
      }
      await UsuarioModel.create(usuarioAoSerSalvo);
      return res.status(200).json({ msg: "Usuario cadastrado com sucesso" })
  } catch (e: any) {
      console.log(e);
      return res.status(400).json({ erro: e.toString() })
    }

  });

export const config = {
  api: {
    bodyParser: false
  }
}

export default conectarMongoDB(handler);
