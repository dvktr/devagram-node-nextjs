import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import { validarJWT } from "../../middlewares/validarTokenJWT";
import { conectarMongoDB } from "../../middlewares/conectaMongoDB";
import { UsuarioModel } from "../../models/UsuarioModel";
import { PublicacaoModel } from "../../models/PublicacaoModel";

const feedEndpoint = async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg | any>) =>{
  try{
    if(req.method === 'GET'){
      if(req?.query?.id){
        const usuario = await UsuarioModel.findById(req?.query?.id)
        if(!usuario){
          res.status(400).json({erro: 'Usuario não encontrado'})
        }
        const publicacoes = await PublicacaoModel
            .find({idUsuario : usuario._id})
            .sort({data : -1});
            
            return res.status(200).json(publicacoes)
      }
     
    }
    res.status(405).json({erro: 'Metodo informado invalido'})
  }catch(e){
    console.log(e);
  }
  res.status(400).json({erro: 'Não foi possivel obter o feed'})
}

export default validarJWT(conectarMongoDB(feedEndpoint));