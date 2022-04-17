import type { NextApiRequest, NextApiResponse, NextApiHandler} from 'next';
import mongoose from 'mongoose';
import type { RespostaPadraoMsg } from '../types/RespostaPadraoMsg'

export const conectarMongoDB = (
  handler : NextApiHandler,) => async (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg>
) => {

  //verificar se o banco estiver conectado
  if(mongoose.connections[0].readyState){
    return handler(req, res);
  }

  //se nao conectar
  const { DB_CONEXAO_STRING } = process.env

  //SE A ENV ESTIVER VAZIA ABORTA O USO E AVISA O PROGRAMADOR
  if(!DB_CONEXAO_STRING){
    return res.status(500).json({erro: "ENV DE CONEXAO DO BANCO NAO INFORMADO!"})
  }

  mongoose.connection.on('connected', () => console.log('Banco de dados conectado'))
  mongoose.connection.on('error', error => console.log(`Ocorreu um erro ao conectar no banco de dados: ${error}`))
  await mongoose.connect(DB_CONEXAO_STRING);

  //agr pode seguir para o endpoint, pois esta conectado no banco
  return handler(req, res);
}