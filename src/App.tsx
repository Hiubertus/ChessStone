import './App.scss';
import { Board } from '@/components';

export const App = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
      }}
    >
      <h1>Chess Game</h1>
      <Board />
    </div>
  );
};
