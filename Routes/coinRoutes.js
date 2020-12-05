const { Router } = require('express')
const express = require('express');
const router = express.Router();
require('dotenv/config')
const cheerio = require('cheerio');
const homeURL = process.env.homeURL;
const specURL = "https://coinmarketcap.com/currencies/";
const fetch = require('node-fetch');
const ids = ['.iJjGCS', '.price___3rj7O ', 'td > .price___SPNWZ', '.cmc-table-homepage___2_guh div .price___SPNWZ', 'td > .kDEzev', '.font_weight_500___2Lmmi', '.hNpJqV']
const coinList = [];

// functions to fetch the data from url
const getTopTen = () => {
    return fetch(`${homeURL}`)
    .then(response => response.text())
}
const getSpecific = (coinName) =>{
    return fetch(`${specURL}${coinName}`)
    .then(response=>response.text())
}

// GET the first 10 coins
router.get('/',(request,response)=>{
    const result = []
    getTopTen().then(body => {
        // console.log(body)
        const res = [[], [], [], [], [], [], [], [], [], []];
        const $ = cheerio.load(body)
        $('.grid tbody tr ' + ids[0]).each((i, elem) => {
            const $name = $(elem)
            // console.log($name.text())
            res[i].push($name.text())
        })
        $('.grid tbody tr ' + ids[1]).each((i, elem) => {
            const $price = $(elem)
            // console.log($price.text())
            res[i].push($price.text())
        })
        $('.grid tbody tr ' + ids[2]).each((i, elem) => {
            const $tFour = $(elem)
            // console.log($tFour.text())
            res[i].push($tFour.text())
        })
        $(ids[3]).each((i, elem) => {
            const $sevenDays = $(elem)
            // console.log($sevenDays.text())
            res[i].push($sevenDays.text())
        })
        $('.grid tbody tr ' + ids[4]).each((i, elem) => {
            const $marketCap = $(elem)
            // console.log($marketCap.text())
            res[i].push($marketCap.text())
        })
        $('.grid tbody tr ' + ids[5]).each((i, elem) => {
            const $volume = $(elem)
            // console.log($volume.text())
            res[i].push($volume.text())
        })
        $('.grid tbody tr ' + ids[6]).each((i, elem) => {
            const $circulationSupply = $(elem)
            // console.log($circulationSupply.text())
            res[i].push($circulationSupply.text())
        })
        // console.log(res)
        for (let i=0;i<res.length;i++){
            coin = {
                "name":res[i][0],
                "price":res[i][1],
                "24Hrs":res[i][2],
                "7Days":res[i][3],
                "marketCap":res[i][4],
                "volume":res[i][5],
                "circulatingSupply":res[i][6],
                "currTimeAndDate": new Date()
                
            }
            coinList.push(coin)
        }
        // console.log(coinList)
        response.send(coinList)
    });
    
})

// GET using the name of the coin
router.get('/:coinName',(request,response)=>{
    const name = request.params.coinName;
    getSpecific(name).then(body =>{
        const $ = cheerio.load(body)
        // console.log($.html())
        let coinArr = []
        $('h1').each((i, elem) => {
            const $name = $(elem)
            coinArr.push($name.text())
        })
        $('.cmc-details-panel-price__price').each((i,elem)=>{
            const $price =$(elem)
            coinArr.push($price.text())
            // console.log($price.text())
        })
        $('.cmc-details-panel-stats li+ li span:nth-child(1)').each((i,elem)=>{
            const $volume = $(elem)
            coinArr.push($volume.text())
        })
        $('.cmc-details-panel-stats div div').each((i,elem)=>{
            const $circSupply = $(elem)
            coinArr.push($circSupply.text())
        })
        $('.cmc-details-panel-price__price-change').each((i,elem)=>{
            const $tFourHrs = $(elem)
            coinArr.push($tFourHrs.text())
        })
        // console.log(coinArr)
        coin = {
            "name":coinArr[0],
            "prices":coinArr[1],
            "volume":coinArr[2],
            "circulatingSupply":coinArr[3],
            "24Hrs":coinArr[4],
            "currTimeAndDate": new Date()
            
        }
        if (coin["name"] == null){
            response.send({"message":"Invalid coin name"})
        }else{
            response.send(coin)
        }
    })
})

module.exports = router;