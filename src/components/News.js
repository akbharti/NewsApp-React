import React, {useEffect, useState} from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) =>   {  
  // apiKey = 'af1ab9a68ef94c6c8cef428b02786cf8';   

  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0) 

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  
   const updateNews = async()=> {
    props.setProgress(0);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    props.setProgress(10);
    setLoading(true)
    props.setProgress(30);
    let data = await fetch(url);
    props.setProgress(50);
    let parseData = await data.json();
    props.setProgress(75);
    setArticles(parseData.articles);
    setTotalResults(parseData.totalResults);
    setLoading(false)
    props.setProgress(100);
   }

   useEffect(() => {
    document.title = `${capitalizeFirstLetter(props.category)} - NewsMonkey`
    updateNews(); // eslint-disable-next-line
    },[]);

    
  //  const handlePrevClick = async() => {
  //     // console.log('Previous')
  //     // let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page - 1}&pageSize=${props.pageSize}`;
  //     // setState({loading : true});
  //     // let data = await fetch(url);
  //     // let parseData = await data.json();
  //     // setState({
  //     //   page : page - 1,
  //     //   articles : parseData.articles,
  //     //   loading : false  
  //     // })
  //   setPage(page - 1 );
  //   updateNews()
  //  }

  //  const handleNextClick = async() => {
  //   // console.log('next');
  // //   if((page + 1 > Math.ceil(totalResults / props.pageSize))) {
  // //     setState({nextPageBtnDisabled : true})
  // //   }
  // //   else{
  // //   let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page +1}&pageSize=${props.pageSize}`;
  // //   setState({loading : true});
  // //   let data = await fetch(url);
  // //   let parseData = await data.json();
  // //   setState({
  // //     page : page + 1,
  // //     articles : parseData.articles,
  // //     loading : false
  // //   })
  // //  }
  //   setPage(page + 1 );
  //   updateNews()
  // }

  const fetchMoreData = async() => {
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
    setPage(page+1)
    let data = await fetch(url);
    let parseData = await data.json();
    setArticles(articles.concat(parseData.articles));
    setTotalResults(parseData.totalResults)
    setLoading(false)
  };


    //  console.log("render")
     return (
       <>
           <h1 className='text-center' style={{margin : '90px 0px 30px 0px'}}>NewsMonkey - Top {capitalizeFirstLetter(props.category)} Headlines</h1>
           {loading && <Spinner />}  
           <InfiniteScroll
                  dataLength={articles.length}
                  next={fetchMoreData}
                  hasMore={articles.length !== totalResults}
                  loader={ <Spinner />}
             >
              
                <div className="container">
                  <div className="row">
                    {/* { !loading && articles.map((element) => { */}
                    { articles.map((element,index) => {
                      return  <div className="col-md-4" key={index}>
                                <NewsItem  title={element.title?element.title:''} description={element.description?element.description:''} 
                                        imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                              </div>
                    })} 
                  </div>
                </div>
           </InfiniteScroll>
       </>
     )
   
}

News.defaultProps = {
  country: 'in',
  pageSize : 6,
  category : 'general'
}

News.propTypes  = {
  country: PropTypes.string,
  pageSize : PropTypes.number, 
  category : PropTypes.string,
}

export default News

