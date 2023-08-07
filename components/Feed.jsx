'use client'

import { useState, useEffect } from 'react'

import PromptCard from './PromptCard'

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className='mt-16 prompt_layout'>
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}>
        </PromptCard>
      ))}
    </div>
  )
}

const Feed = () => {
  const [searchText, setSearchText] = useState('');
  const [posts, setPosts] = useState([]);
  const [searchedResults, setSearchedResults] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const filtered = filterPosts(e.target.value);
        setSearchedResults(filtered);
      }, 500)
    );
  }

  const handleTagClick = (tagName) => {
    setSearchText(tagName);
    const filtered = filterPosts(tagName);
    setSearchedResults(filtered);
  }

  const filterPosts = (paramSearch) => {
    const regex = new RegExp(paramSearch, 'i'); // 'i' flag for ignore case or case-insensitive search
    return posts.filter((item) => (
      regex.test(item.creator.name) ||
      regex.test(item.prompt) ||
      regex.test(item.tag)
    ));
  }

  const fetchPosts = async () => {
    const response = await fetch('/api/prompt');
    const data = await response.json();

    setPosts(data);
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <section className='feed'>
      <form className='relative w-full flex-center'>
        <input
          type='text'
          placeholder='Search for a tag or a username'
          value={searchText}
          onChange={handleSearchChange}
          required
          className='search_input peer'
        >
        </input>
      </form>

      {
        searchText ? (
          <PromptCardList
            data={searchedResults}
            handleTagClick={handleTagClick}
          />
        ) : (
          <PromptCardList
            data={posts}
            handleTagClick={handleTagClick}>
          </PromptCardList>
        )
      }
    </section>
  )
}

export default Feed