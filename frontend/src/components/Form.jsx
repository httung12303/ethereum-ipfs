import { useState } from 'react';

export default function Form() {
  const [file, setFile] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setResult('');
    setLoading(true);
    await fetch('http://localhost:5000/add', {
      method: 'POST',
      body: JSON.stringify({
        file_path: file,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(async (response) => {
        const status = response.status;
        if (status === 201) {
          setResult('File uploaded successfully');
        } else {
          return await response.json().then((json) => {
            throw new Error(json.error);
          });
        }
      })
      .catch((error) => {
        setResult(error.message);
      });
    setLoading(false);
  }
  return (
    <>
      <div className='text-center mb-4 text-xl text-[#FFC100]'>{result}</div>
      <form
        action=""
        onSubmit={() => {}}
        className="flex flex-row justify-center gap-6 mb-10"
      >
        <input
          type="text"
          value={file}
          onChange={(e) => setFile(e.currentTarget.value)}
          className="bg-transparent border-2 border-[#4D5061] placeholder:text-[#4D5061] py-2 px-4 w-1/2 rounded-md"
          placeholder="File path"
        />
        <button
          type="submit"
          onClick={handleSubmit}
          className={`py-2 px-4 bg-[#5C80BC] rounded-md ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          disabled={file === '' || loading ? true : false}
        >
          Upload
        </button>
      </form>
    </>
  );
}
