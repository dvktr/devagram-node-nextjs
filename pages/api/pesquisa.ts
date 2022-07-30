import type {NextApiRequest, NextApiResponse} from 'next';
import { conectarMongoDB } from '../../middlewares/conectaMongoDB';
import { validarJWT } from '../../middlewares/validarTokenJWT';
import { UsuarioModel } from '../../models/UsuarioModel';
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import usuario from './usuario';

const pesquisaEndPoint = async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg | any>) => {
  try {
    if(req.method === 'GET'){

      if(req.query.id){
        const usuariosEncontrados = await UsuarioModel.findById(req?.query?.id)
        if(!usuariosEncontrados){
          return res.status(400).json({erro: 'Usuario não encontrado'})
        }
        usuariosEncontrados.senha = null
        return res.status(200).json(usuariosEncontrados);
      }else{
        const {filtro} = req.query;

      if(!filtro || filtro.length < 2){
        return res.status(400).json({erro: 'Favor informar pelo menos 2 caracteres'})
      }

      const usuariosEncontrados = await UsuarioModel.find({
        nome: {$regex : filtro, $options: 'i'}
      });
      usuariosEncontrados.forEach(e => e.senha = null);
      return res.status(200).json(usuariosEncontrados);
      }

      

    } else {
      return res.status(405).json({erro: 'Metodo informado nao e valido'})
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({erro: 'Não foi possível buscar usuários: ' + e})
  }
}

export default validarJWT(conectarMongoDB(pesquisaEndPoint))