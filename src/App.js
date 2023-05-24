import React, { useEffect, useState } from 'react';
import './App.css';
import Tmdb from './Tmdb';
import MovieRow from './components/MovieRow';
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header';


export default () => {

  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(() => {
    const loadAll = async () => {
      // pegar toda a lista
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      // pegando o featured
      let originals = list.filter(i=>i.slug === 'originals');
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
      setFeaturedData(chosenInfo);

    }

    loadAll();
  }, []);

useEffect(() => {
  const scrollListener = () => {   //* y = vertical x = horizontal
    if(window.scrollY > 10) {
      setBlackHeader(true);
    } else {
      setBlackHeader(false);
    }
  }

  window.addEventListener('scroll', scrollListener);
  return () => {
    window.removeEventListener('scroll', scrollListener);
  }
}, []);

  return (
    <div className="page">

      <Header black={blackHeader} />
      
      {featuredData &&
        <FeaturedMovie item={featuredData} />
      }

      <section className="lists">
        {movieList.map((item, key) => (
          
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>

      <footer>
        <span>Feito com amor e dedicação pelo Daniel com a ajuda da B7Web!!!</span><br />
        Direitos de imagem para netflix<br />
        Dados pegos do site Themoviedb.org
      </footer>
      
      {movieList.length <= 0 &&
      <div className="loading">
        <img src="https://media.tenor.com/Rfyx9OkRI38AAAAC/netflix-netflix-startup.gif" alt="Carregando"/>
      </div>
      }
    </div>
  )
}