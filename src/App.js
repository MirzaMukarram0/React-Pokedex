import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

// Main App component
function App() {
  return (
    <Router>
      <div className="container mx-auto px-4 py-8">
        <nav className="mb-4">
          <ul className="flex space-x-4">
            <li><Link to="/" className="text-blue-500 hover:underline">Home</Link></li>
            <li><Link to="/types" className="text-blue-500 hover:underline">Types</Link></li>
            <li><Link to="/favorites" className="text-blue-500 hover:underline">Favorites</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<PokemonList />} />
          <Route path="/pokemon/:id" element={<PokemonDetail />} />
          <Route path="/types" element={<TypeChart />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </div>
    </Router>
  );
}

// PokemonList component
function PokemonList() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
        const data = await response.json();
        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            return res.json();
          })
        );
        setPokemon(pokemonDetails);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Pokemon:', error);
        setLoading(false);
      }
    };
    fetchPokemon();
  }, []);

  const filteredPokemon = pokemon.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || p.types.some((t) => t.type.name === selectedType);
    return matchesSearch && matchesType;
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Pokémon Explorer</h1>
      <input
        type="text"
        placeholder="Search Pokémon..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 p-2 border rounded"
      />
      <select
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
        className="mb-4 p-2 border rounded"
      >
        <option value="all">All Types</option>
        <option value="normal">Normal</option>
        <option value="fire">Fire</option>
        <option value="water">Water</option>
        {/* Add more type options here */}
      </select>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPokemon.map((p) => (
          <div key={p.id} className="border p-4 rounded">
            <img
              src={p.sprites.front_default}
              alt={p.name}
              className="mx-auto"
            />
            <h2 className="text-xl font-bold capitalize">{p.name}</h2>
            <p>#{p.id.toString().padStart(3, '0')}</p>
            <div className="mt-2">
              {p.types.map((type) => (
                <span
                  key={type.type.name}
                  className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                >
                  {type.type.name}
                </span>
              ))}
            </div>
            <Link to={`/pokemon/${p.id}`} className="text-blue-500 hover:underline">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

// PokemonDetail component
function PokemonDetail() {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const id = window.location.pathname.split('/').pop();

  useEffect(() => {
    const fetchPokemonDetail = async () => {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await response.json();
        setPokemon(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Pokemon details:', error);
        setLoading(false);
      }
    };
    fetchPokemonDetail();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!pokemon) {
    return <div>Pokemon not found</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 capitalize">{pokemon.name}</h1>
      <img
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
        className="mx-auto"
      />
      <div className="mt-4">
        <h2 className="text-xl font-bold">Stats</h2>
        {pokemon.stats.map((stat) => (
          <div key={stat.stat.name} className="mt-2">
            <span className="font-semibold capitalize">{stat.stat.name}:</span> {stat.base_stat}
          </div>
        ))}
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-bold">Abilities</h2>
        <ul>
          {pokemon.abilities.map((ability) => (
            <li key={ability.ability.name} className="capitalize">{ability.ability.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// TypeChart component
function TypeChart() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Type Chart</h1>
      <p>This page will display the type effectiveness chart.</p>
    </div>
  );
}

// Favorites component
function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Favorite Pokémon</h1>
      {favorites.length === 0 ? (
        <p>You haven't added any Pokémon to your favorites yet.</p>
      ) : (
        <ul>
          {favorites.map((pokemonId) => (
            <li key={pokemonId}>
              <Link to={`/pokemon/${pokemonId}`} className="text-blue-500 hover:underline">
                Pokémon #{pokemonId}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;