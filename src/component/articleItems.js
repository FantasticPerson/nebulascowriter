import React, { Component } from 'react';
import ArticleItem from './articleItem'
import { Layout,Button,Pagination } from 'antd';
import ReactLoading from 'react-loading'
import '../styles/articleItems.css'
import StateManager from '../utils/stateManager'
import EventBus from '../utils/eventBus'

export default class Article extends Component{
    constructor(){
        super()
        this.history = StateManager.getHistory()
        this.state = {data:null,mode:'edit'}
        EventBus.addListener('enterItem',(data)=>{
            if(this._mounted){
                let res = StateManager.enterItem()
                this.setState({data:res})
            }
        })
    }

    componentDidMount(){
        this._mounted = true
        

        StateManager.getArticleItemList().then(()=>{
            if(this._mounted){
                let data = StateManager.enterItem()
                this.setState({data:data})
            }
        })
    }

    componentWillUnmount(){
        this._mounted = false
    }

    changeMode(){
        const {mode} = this.state
        this.setState({mode:mode=='edit'?'read':'edit'})
    }

    render(){
        const {mode} = this.state
        let modeText = mode == 'deit' ? '阅读模式' : '普通模式'
        let contentStyle = {padding:'10px',position: 'fixed',top: '115px',bottom: '7px',overflowY: 'auto',width:'800px',margin:'4px auto',left:0,right:0}
        return(
            <div>
                <div className="toolbar">
                    <Button onClick={()=>{this.changeMode()}} type="primary">阅读模式</Button>
                </div>
                <div style={contentStyle}>
                    {this.renderContent()}
                </div>           
            </div>
        )
    }

    renderContent(){
        const {data,mode} = this.state
        if(data){
            let articleItems = data.map((item)=>{
                return (<ArticleItem mode={mode} key={item.data.id} data={item}></ArticleItem>)
            })
            return (
                <div>
                    {articleItems}
                </div>
            )
        } else {
            return(
                <div style={{margin:'10px auto',width:'60px'}}>
                    <ReactLoading type={'spin'} color={'#91d5ff'}  height={100} width={60} delay={0}></ReactLoading>
                </div>
            )
        }
    }
}