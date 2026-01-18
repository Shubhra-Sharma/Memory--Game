import { useState, useEffect } from "react";
import './Memory.css';
function Memory() {
  const [pokemons, setPokemons] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const[score,setScore] = useState(0);
  const [maxscore,setMaxscore] = useState(0);
  let [freq,setFreq] = useState([...Array(151)].map(() => false));
  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        
        if (!response.ok) {
          throw new Error('Failed to fetch Pokemon data');
        }
        
        const data = await response.json();
          const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            return res.json();
          })
        );
        
        setPokemons(pokemonDetails);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPokemon();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!pokemons) return <div>Pokemon couldnt be fetched!</div>;

  function handlePokeClick(index){
        const ufreq = [...freq];
        if(freq[index] == true) {
            setScore(0);
            setFreq([...Array(151)].map(() => false));
        }
        else{
        const n = pokemons.length ;
        const updated = [...pokemons];
        const idx = (index + 5)%n;
        [updated[index],updated[idx]] = [updated[idx],updated[index]];// index is unchanged
        setPokemons(updated);
        if(ufreq[idx]==true) ufreq[index] = true;
        else ufreq[index] = false;
        ufreq[idx] = true;
        setFreq(ufreq);
        const umaxscore = Math.max(maxscore,score+1);
        setMaxscore(umaxscore);
        setScore(score+1);
        }
    
  }
  


  return (
     <div style={{ textAlign: 'center', padding: '20px'}}>
        <h3>Do not click on any pokemon twice or else score resets to 0! 
            <br/> Your score is {score}
            <br/>Maximum Score: {maxscore}</h3>
      <ul className = "poke-Card">
      {pokemons.map( (pokemon,index) => <li key = {index} onClick = {() => handlePokeClick(index)}>
      <img 
        src={pokemon.sprites.front_default} 
        alt={pokemon.name}
        style={{ width: '200px' }}
      />
      <h1>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h1>
      </li>)}
      </ul>
    </div>
  );
}

export default Memory;