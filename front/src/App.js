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

    socket.on('chatMessage', (data) => {
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
      socket.off('chatMessage');
      socket.off('usersOnline');
      socket.off('usersInGame');
    }

  }, []);

  const enviarMensaje = () => {
    socket.emit('chatMessage', {
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

      <button className='btn btn-primary mx-2 my-2' onClick={entrarPartida}> <i class="bi bi-play-circle"></i> Entrar a partida</button>
      <button className='btn btn-warning mx-2 my-2' onClick={salirPartida}><i class="bi bi-box-arrow-left"></i> Salir a la lobby</button>

      <div className='row'>
        <div className='col-3'><h2>Usuarios online: </h2>
          <ul class=" ul-chat list-group bg-light">
            {usersOnline.map(item => (
              <li class="list-group-item ">{item} {usersInGame.includes(item) ? <span className='text-danger'>En partida</span> : <span className='text-success'>Online</span>}

              </li>
            ))}

          </ul>
        </div>


        <div className='col-3'>
          <h2>Usuarios en partida: </h2>
          <ul class=" ul-chat list-group bg-light">
            {usersInGame.map(item => (
              <li class="list-group-item">{item}


              </li>
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

          <input type="text" onChange={e => setNuevoMensaje(e.target.value)} />
          <button className='btn btn-primary mx-2 my-2' onClick={enviarMensaje}><i class="bi bi-send"></i></button>

        </div>

      </div>
    </div>
  );
}

export default App;
