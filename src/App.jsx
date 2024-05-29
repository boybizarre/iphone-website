import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Highlights from './components/Highlights';
import Model from './components/Model';

const App = () => {
  return (
    <h1 className='bg-black'>
      <Navbar />
      <Hero />
      <Highlights />
      <Model />
    </h1>
  );
};

export default App;
