import React, {Component} from 'react';
import MultiCard from './MultiCard';
import RegularCard from './RegularCard';
import RandomWeighted from './RandomWeighted';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
library.add(faSpinner);

class FlashCard extends Component{
    constructor(){
        super();
        this.apiHost = `https://aws-services.robertbunch.dev/services`;
        this.state = {
           flipClass: "",
           questonData: ""
        }
    }

    flip = (e)=>{
        let newFlip = this.state.flipClass === "" ? "flip" : ""
        this.setState({
            flipClass: newFlip
        })
    }
    
    newCard = () =>{
        let path;

        const cardStyle = this.props.cardStyle;

        if((cardStyle === 'Random') || (cardStyle === 'Regular')){
            path = this.apiHost+'/all'
        }else if(cardStyle === 'Weighted'){
            path = this.apiHost+'/weighted'
        }else{
            path = this.apiHost+'/multi'
        }
        axios.get(path).then((response)=>{
            this.setState({
                questionData: response.data,
            })
            this.props.nowReady();
        })
    }

    render(){
        if(!this.props.ready)
        {
            this.newCard();
            return(
                <div className="spinner-wrapper">
                    <FontAwesomeIcon icon="spinner" size="6x" spin/>
                </div>
            )
        }
            const Cstyle = this.props.cardStyle;
            let card;
            if(Cstyle === 'Multi'){
                card = <MultiCard questionData={this.state.questionData} />
            }else if(Cstyle === 'Regular'){
                card = <RegularCard questionData={this.state.questionData} />
            }else{
                card = <RandomWeighted questionData={this.state.questionData} />
            }
        return(
            <div>
                <div className="row align-items-center card-holder">
                    <div onClick={this.flip} className={`col-sm-6 offset-sm-3 card mb-3 ${this.state.flipClass}`}>
                        {card}
                    </div>
                </div>
                <button onClick={this.newCard} className="btn btn-primary btn-lg">Next Question!</button>
            </div>
        )
    }
}

export default FlashCard;