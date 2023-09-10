import './App.css';
import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';
import logo from './assets/images/logo-imascono.png';

const socket = io('http://localhost:3000');

function App() {

  const [isConnected, setIsConnected] = useState(false);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [mensajes, setMensajes] = useState([]);
  const [usersOnline, setUsersOnline] = useState([]);
  const [usersInGame, setUsersInGame] = useState([]);

  useEffect(() => {

    socket.on('connect', () => setIsConnected(true));

    socket.on('chat_message', (data) => {
      setMensajes(mensajes => [...mensajes, data]);
    });

    socket.on('usersOnline', (data) => {
      setUsersOnline(data);
    });

    socket.on('usersInGame', (data) => {
      setUsersInGame(data);
    });

    return () => {
      socket.off('connect');
      socket.off('chat_message');
      socket.off('usersOnline');
    }

  }, []);

  const enviarMensaje = () => {
    socket.emit('chat_message', {
      usuario: socket.id,
      mensaje: nuevoMensaje
    });
  }

  const entrarPartida = () => {
    const prevRoom = 'Lobby';
    const nextRoom = 'Game';
    if (socket) socket.emit('switch', { prevRoom, nextRoom });
  }

  const salirPartida = () => {
    const prevRoom = 'Game';
    const nextRoom = 'Lobby';
    if (socket) socket.emit('switch', { prevRoom, nextRoom });
  }

  return (
    <div className="App bg-dark text-white">


      <nav className="navbar">
        <div className="navbar-brand" >
          <img src={logo} width={50} height={50} className="d-inline-block align-top" alt="" />
          <h2 className='float-right mx-2 text-light'>Imascono</h2>
        </div>
      </nav>


      <h2>{isConnected ? 'Conectado al servidor' : 'No conectado al servidor'}</h2>

      <button className='btn btn-primary mx-2 my-2' onClick={entrarPartida}>Entrar a partida</button>
      <button className='btn btn-warning mx-2 my-2' onClick={salirPartida}>Salir de la partida</button>


      <div className='row'>

        <div className='col-3'><h2>Usuarios Online: </h2>
          <ul class=" ul-chat list-group bg-light">
            {usersOnline.map(item => (
              <li class="list-group-item ">{item}</li>
            ))}

          </ul>
        </div>


        <div className='col-3'>
          <h2>Usuarios InGame: </h2>
          <ul class=" ul-chat list-group bg-light">
            {usersInGame.map(item => (
              <li class="list-group-item">{item}</li>
            ))}

          </ul>

        </div>

        <div className='col-6'>
          <h2>Chat general</h2>
          <ul class=" ul-chat list-group">
            {mensajes.map(mensaje => (
              <li class="list-group-item">{mensaje.usuario}: {mensaje.mensaje}</li>
            ))}

          </ul>
          <input
            type="text"
            onChange={e => setNuevoMensaje(e.target.value)}
          />
          <button className='btn btn-primary mx-2 my-2' onClick={enviarMensaje}>Enviar</button>
        </div>

      </div>
    </div>
  );
}

export default App;
