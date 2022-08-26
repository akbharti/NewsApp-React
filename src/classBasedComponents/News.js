import React, { Component } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {  
  apiKey = 'af1ab9a68ef94c6c8cef428b02786cf8';   
  static defaultProps = {
    country: 'in',
    pageSize : 6,
    category : 'general'
  }

  static propTypes  = {
    country: PropTypes.string,
    pageSize : PropTypes.number, 
    category : PropTypes.string,
  }

   constructor(props){
       super(props);
      //  console.log('Hello I am a constructer from News components')
       this.state = {
           articles : [],
           loading : false,     // will be used to add spinner 
           page : 1,
          //  nextPageBtnDisabled : false
          totalResults : 0
       }
        document.title = `${this.capitalizeFirstLetter(this.props.category)} - NewsMonkey`
   }

    capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

   async updateNews() {
    this.props.setProgress(0);
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.props.setProgress(10);
    this.setState({loading : true});
    this.props.setProgress(30);
    let data = await fetch(url);
    this.props.setProgress(50);
    let parseData = await data.json();
    this.props.setProgress(75);
    this.setState({ 
                   articles : parseData.articles, 
                   totalResults : parseData.totalResults,
                   loading : false
                 })
    this.props.setProgress(100);
   }

   async componentDidMount() {
      //  console.log("cdm");
      //  let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=1&pageSize=${this.props.pageSize}`;
      //  this.setState({loading : true});
      //  let data = await fetch(url);
      //  let parseData = await data.json();
      //  console.log(parseData);
      //  this.setState({ 
      //                 articles : parseData.articles, 
      //                 totalResults : parseData.totalResults,
      //                 loading : false
      //               })
      this.updateNews();
    }
    
  //   handlePrevClick = async() => {
  //     // console.log('Previous')
  //     // let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page - 1}&pageSize=${this.props.pageSize}`;
  //     // this.setState({loading : true});
  //     // let data = await fetch(url);
  //     // let parseData = await data.json();
  //     // this.setState({
  //     //   page : this.state.page - 1,
  //     //   articles : parseData.articles,
  //     //   loading : false  
  //     // })
  //       this.setState({page : this.state.page -1});
  //       this.updateNews();
  //  }

  //   handleNextClick = async() => {
  //   // console.log('next');
  // //   if((this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize))) {
  // //     this.setState({nextPageBtnDisabled : true})
  // //   }
  // //   else{
  // //   let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page +1}&pageSize=${this.props.pageSize}`;
  // //   this.setState({loading : true});
  // //   let data = await fetch(url);
  // //   let parseData = await data.json();
  // //   this.setState({
  // //     page : this.state.page + 1,
  // //     articles : parseData.articles,
  // //     loading : false
  // //   })
  // //  }
  //   this.setState({page : this.state.page + 1});
  //   this.updateNews()
  // }

  fetchMoreData = async() => {
    this.setState({ page: this.state.page + 1});
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    // this.setState({loading : true});
    let data = await fetch(url);
    let parseData = await data.json();
    this.setState({ 
                   articles : this.state.articles.concat(parseData.articles), 
                   totalResults : parseData.totalResults,
                   loading : false
                 })
  };

   render() {
    //  console.log("render")
     return (
       <>
           <h1 className='text-center' style={{margin : '40px 0px'}}>NewsMonkey - Top {this.capitalizeFirstLetter(this.props.category)} Headlines</h1>
           {this.state.loading && <Spinner />}  
           <InfiniteScroll
                  dataLength={this.state.articles.length}
                  next={this.fetchMoreData}
                  hasMore={this.state.articles.length !== this.state.totalResults}
                  loader={ <Spinner />}
             >
              
                <div className="container">
                  <div className="row">
                    {/* { !this.state.loading && this.state.articles.map((element) => { */}
                    { this.state.articles.map((element,index) => {
                      return  <div className="col-md-4" key={index}>
                                <NewsItem  title={element.title?element.title:''} description={element.description?element.description:''} 
                                        imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                              </div>
                    })} 
                  </div>
                </div>
           </InfiniteScroll>
           {/* <div className="container d-flex justify-content-between">
           <button type="button" disabled={this.state.page <= 1} className="btn btn-dark" onClick={this.handlePrevClick} > &larr; Previous</button>
           <button type="button" disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize)} className="btn btn-dark" onClick={this.handleNextClick} >Next &rarr;</button>
          //  <button type="button" disabled={this.state.nextPageBtnDisabled} className="btn btn-dark" onClick={this.handleNextClick} >Next &rarr;</button>
           </div>   */}
       </>
     )
   }
}

export default News

