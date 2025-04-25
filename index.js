// pages/index.js
import { useState, useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function App() {
  const [lesson, setLesson] = useState('');
  const [lessons, setLessons] = useState([]);
  const { data: session } = useSession();

  // Učitaj podatke iz localStorage
  useEffect(() => {
    const saved = localStorage.getItem('lessons');
    if (saved) setLessons(JSON.parse(saved));
  }, []);

  const addLesson = () => {
    if (!lesson.trim()) return;
    
    const newLesson = {
      text: lesson,
      date: new Date().toLocaleString(),
      user: session?.user?.email || 'guest',
    };

    const updatedLessons = [...lessons, newLesson];
    setLessons(updatedLessons);
    localStorage.setItem('lessons', JSON.stringify(updatedLessons));
    setLesson('');
  };

  return (
    <div className="container">
      {session ? (
        <>
          <h1>Danas sam naučio ({session.user.email})</h1>
          <input 
            value={lesson}
            onChange={(e) => setLesson(e.target.value)}
            placeholder="Napiši šta si naučio..."
          />
          <button onClick={addLesson}>Sačuvaj</button>
          <button onClick={() => signOut()}>Odjavi se</button>

          <ul>
            {lessons.map((item, i) => (
              <li key={i}>
                <strong>{item.date}</strong>: {item.text}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <button onClick={() => signIn('google')}>Prijavi se preko Google-a</button>
      )}
    </div>
  );
        }
