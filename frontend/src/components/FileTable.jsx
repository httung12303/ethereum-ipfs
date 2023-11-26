import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import TableHeading from './TableHeading';
import TableCell from './TableCell';

export default function FileTable() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  async function getFiles() {
    setLoading(true);
    await fetch('http://127.0.0.1:5000/get_file/all')
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          setFiles([]);
          throw new Error('Something unexpected happened');
        }
      })
      .then((json) => setFiles(json.files))
      .catch((error) => alert(error));
    setLoading(false);
  }
  useEffect(() => {
    getFiles();
  }, []);
  function formatTime(timestamp) {
    let date = new Date(timestamp);

    let formattedDate = format(date, 'dd/MM/yyyy HH:mm:ss');

    return formattedDate;
  }
  function formatFileSize(bytes) {
    if (bytes < 0) {
      return 'Invalid file size';
    }

    const units = [' B', ' KB', ' MB', ' GB', ' TB', ' PB'];

    let formattedSize = '';

    for (let i = units.length - 1; i >= 0; i--) {
      let power = Math.pow(1024, i);

      if (bytes >= power) {
        let value = Math.round((bytes / power) * 100) / 100;

        // Add the value and the unit without a space
        formattedSize += value + units[i];

        bytes -= value * power;

        break
      }
    }

    return formattedSize;
  }

  return (
    <div className="relative">
      <button
        className={`absolute top-0 right-0 py-2 px-4 bg-[#5C80BC] rounded-md ${
          loading ? 'opacity-60 cursor-not-allowed' : ''
        }`}
        onClick={() => getFiles()}
        disabled={loading}
      >
        Reload
      </button>
      <table className="table-auto border-collapse">
        <caption className="text-2xl font-bold mb-4">Files Uploaded</caption>
        <thead>
          <tr>
            {['ID', 'Name', 'Size', 'Upload Time', 'Uploader', 'URL'].map(
              (label, index) => (
                <TableHeading label={label} key={index} />
              )
            )}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <TableCell colSpan={6}>Loading...</TableCell>
            </tr>
          ) : files.length ? (
            files.map((file) => {
              const [id, hash, size, , name, upload_time, uploader] = file;
              return (
                <tr key={id}>
                  <TableCell>{id}</TableCell>
                  <TableCell>{name}</TableCell>
                  <TableCell>{formatFileSize(size)}</TableCell>
                  <TableCell>{formatTime(upload_time * 1000)}</TableCell>
                  <TableCell>{uploader}</TableCell>
                  <TableCell>
                    <a href={`http://127.0.0.1:8080/ipfs/${hash}`} >📂</a>
                  </TableCell>
                </tr>
              );
            })
          ) : (
            <tr>
              <TableCell colSpan={6}>
                No files found. Reload the table to check for updates.
              </TableCell>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
