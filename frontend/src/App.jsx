import FileTable from './components/FileTable';
import Form from './components/Form';

function App() {
  return (
    <>
      <header className='text-3xl font-bold mb-16'>
        Distributed file system using private IPFS + Ethereum network
      </header>
      <main className='flex-grow'>
        <Form />
        <FileTable />
      </main>
      <footer>
        Created by <a href="https://github.com/httung12303" className='text-[#FFC100]'>httung12303</a>
      </footer>
    </>
  );
}

export default App;
