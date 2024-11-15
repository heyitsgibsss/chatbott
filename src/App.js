import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import logobot from './hermesAI.png';
import logouser from './user.png';
import './App.css';
import {build_dictionary, clean_input, response_user, response_bot, get_time, get_date} from './functions.js';
import $ from 'jquery';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import { Card } from 'react-bootstrap';
import { FiSend } from "react-icons/fi";
import ParentComponent from './components/Toggle.jsx';

// get data
const brain = require('brain.js');
const trainingPhrases = require('./data/data-patterns.json'); 
const data_responses = require('./data/data-responses.json'); 

// build dictionary
const dictionary = build_dictionary(trainingPhrases);
//console.log(dictionary); // print dictionary
console.log('Input: Front End'); // test encoding text input
console.log('Encoded: '+encode('Front End')); // test encoding text input

// prepare your training data
const trainingSet = trainingPhrases.map(dataSet => {
	const encodedValue = encode(dataSet.phrase)
	return {input: encodedValue, output: dataSet.result}
});

// train neural network
const model_network = new brain.NeuralNetwork();
model_network.train(trainingSet);

// encoding text to number format
function encode(phrase) {
  const phraseTokens = phrase.split(' ')
  const encodedPhrase = dictionary.map(word => phraseTokens.includes(word) ? 1 : 0)

  return encodedPhrase;
}

function containsProfanity(input) {
	const profanityList = ['bangsat', 'anjir', 'bangke', 'fuck', 'bitch', 'kontol', 'babi', 'bajingan'];
	const lowerCaseInput = input.toLowerCase();
  
	return profanityList.some(profanity => lowerCaseInput.includes(profanity));
}

function calculateMathExpression(expression) {
	try {
	  const result = eval(expression); // Gunakan eval untuk mengevaluasi ekspresi matematika
	  return result;
	} catch (error) {
	  return 'Maaf, saya tidak dapat menghitung hasilnya.';
	}
  }
  
  function getMathResponse(operation, operand1, operand2, result) {
	switch (operation) {
	  case '+':
		return `${operand1} ${operation} ${operand2} = ${result}`;
	  case '-':
		return `${operand1} ${operation} ${operand2} = ${result}`;
	  case '*':
		return `${operand1} ${operation} ${operand2} = ${result}`;
	  case '/':
		return `${operand1} ${operation} ${operand2} = ${result}`;
	  default:
		return 'Maaf, saya tidak dapat mengerti operasi matematika tersebut.';
	}
  }

// component function
function App() {
	// set current time 
	const [currentTime, setCurrentTime] = React.useState(get_time(new Date));

	React.useEffect(() => {
		const intervalId = setInterval(() => {
			setCurrentTime(get_time(new Date));
		}, 1000);

		return() => clearInterval(intervalId);
	}, []);

	// make a prediction
	function predict_bot(txt_chat_input) {
		// encode input text
		const encoded = encode(clean_input(txt_chat_input));
		// predict the response
		const json_output = model_network.run(encoded);
		console.log("Max Categories: " + Object.values(json_output).length + " intents.");
		console.log(json_output);
	  
		// get max value using apply
		const max = Math.max.apply(null, Object.values(json_output));
		const index = Object.values(json_output).indexOf(max);
		// get probability and pred_label
		const pred_label = Object.keys(json_output)[index];
		const pred_prob = json_output['' + pred_label];
	  
		const pred_responses = data_responses.find(response => response[pred_label] != null);
		const responsesArray = pred_responses[pred_label];
	  
		let pred_response = "Maaf, saya belum tahu cara merespons ini.";
	  
		if (responsesArray) {
		  // Randomly select a response
		  const randomIndex = Math.floor(Math.random() * responsesArray.length);
		  pred_response = responsesArray[randomIndex];
		}
	  
		console.log('Predicted label (' + pred_label + '), probability (' + pred_prob + ').');
		return [pred_response, pred_prob];
	  }

	// compile/execute chatbot
	function run_chatbot() {
		var input_chat = $('#input-chat').val(); // get input chat
		if (input_chat.length === 0) {
			const emptyChatResponses = [
				"Ada yang bisa saya bantu?",
				"Apakah kamu tersesat?",
				"Saya ada disini, apa yang ingin kamu tanyakan?"
			  ];
			  const randomResponse = emptyChatResponses[Math.floor(Math.random() * emptyChatResponses.length)];
		  
			  $("#content-chat-feed").append(response_bot(randomResponse, 100, get_time(new Date())));
			  force_scroll_bottom();
		} else if (containsProfanity(input_chat)) {
		  setTimeout(() => {
			$('#input-chat').val('');
			const profanityResponses = [
			  "Hey, jangan ngomong kasar!!",
			  "Saya hapus ya kamu ngomong kasar!!",
			  "Tidak bagus ngomong kasar!"
			];
			const randomResponse = profanityResponses[Math.floor(Math.random() * profanityResponses.length)];
	  
			$("#content-chat-feed").append(response_bot(randomResponse, 100, get_time(new Date())));
			force_scroll_bottom();
		  }, 1000);
		} else {
			// Periksa apakah pertanyaan berkaitan dengan matematika
			if (input_chat.match(/[-+*/]/)) {
			  const operator = input_chat.match(/[-+*/]/)[0];
			  const operands = input_chat.split(operator);
		
			  // Periksa apakah operand valid
			  if (operands.length === 2 && !isNaN(operands[0]) && !isNaN(operands[1])) {
				const mathResult = calculateMathExpression(input_chat);
				const mathResponse = getMathResponse(operator, operands[0], operands[1], mathResult);
		
				// Tambahkan respons matematika ke chat feed
				$("#content-chat-feed").append(response_bot(mathResponse, 100, get_time(new Date())));
				force_scroll_bottom();
				$('#input-chat').val('');
			  } else {
				// Jika operand tidak valid
				$("#content-chat-feed").append(response_bot("Maaf, sepertinya pertanyaan matematika tidak valid.", 100, get_time(new Date())));
				force_scroll_bottom();
				$('#input-chat').val('');
			  }
		} else {
		  // Input tidak mengandung kata kasar
		  $("#content-chat-feed").append(response_user(input_chat, get_time(new Date)));
		  force_scroll_bottom();
			// Mengecek apakah pertanyaan berkaitan dengan waktu dan tanggal
if (input_chat.toLowerCase().includes('jam berapa sekarang') ||
	input_chat.toLowerCase().includes('waktu sekarang') ||
	input_chat.toLowerCase().includes('jam berapa') ||
	input_chat.toLowerCase().includes('jam sekarang') ||
	input_chat.toLowerCase().includes('waktu') ||
	input_chat.toLowerCase().includes('jam berapa ini')){
		const possibleResponses = [
			`Jam sekarang : ${get_time(new Date())}`,
			`Jam ${get_time(new Date())}`,
			`Waktu saat ini ${get_time(new Date())}`, 
			`Waktu menunjukkan pukul ${get_time(new Date())}`, 
		  ];

		  const randomResponse = possibleResponses[Math.floor(Math.random() * possibleResponses.length)];
		
		  $("#content-chat-feed").append(response_bot(randomResponse, 100, get_time(new Date())));		
  } else if (
	input_chat.toLowerCase().includes('tanggal sekarang') ||
	input_chat.toLowerCase().includes('hari ini tanggal berapa') ||
	input_chat.toLowerCase().includes('tanggal hari ini') ||
	input_chat.toLowerCase().includes('hari ini tanggal') ||
	input_chat.toLowerCase().includes('tanggal') ||
	input_chat.toLowerCase().includes('tanggal berapa') ||
	input_chat.toLowerCase().includes('hari ini tanggal berapa ya')
  ) {
	const possibleResponses = [
	  `Tanggal hari ini: ${get_date(new Date())}`,
	  `Hari ini tanggal: ${get_date(new Date())}`,
	  `Tanggal saat ini: ${get_date(new Date())}`,
	  `Tanggal ${get_date(new Date())}`,
	];

	const randomResponse = possibleResponses[Math.floor(Math.random() * possibleResponses.length)];
	$("#content-chat-feed").append(response_bot(randomResponse, 100, get_date(new Date())));
  } else if (input_chat.toLowerCase().includes('bulan ini tanggal berapa')) {
	const specificResponse = `Sekarang bulan ${new Date().toLocaleString('default', { month: 'long' })}, tanggal: ${new Date().getDate()}`;
	$("#content-chat-feed").append(response_bot(specificResponse, 100, get_date(new Date())));
  } else if (input_chat.toLowerCase().includes('tahun ini tanggal berapa')) {
	const specificResponse = `Sekarang tahun ${new Date().getFullYear()}, tanggal: ${new Date().getDate()}`;
	$("#content-chat-feed").append(response_bot(specificResponse, 100, get_date(new Date())));
  }  else if (input_chat.toLowerCase().includes('hari ini hari apa')) {
	const dayOfWeek = new Date().toLocaleDateString('id-ID', { weekday: 'long' });
	const specificResponse = `Hari ini adalah ${dayOfWeek}, ${get_date(new Date())}`;
	$("#content-chat-feed").append(response_bot(specificResponse, 100, get_date(new Date())));
  } else {
	// Jika tidak, melakukan prediksi respons chatbot seperti sebelumnya
	const [respond_bot, prob_bot] = predict_bot(input_chat);
	const prob_val = (parseFloat(prob_bot) * 100).toFixed(2);
			  
				console.log('Response: ' + respond_bot);
			  
				const threshold = 70;
				if (prob_val > threshold) {
				  // Menambahkan respons chatbot tanpa waktu dan tanggal saat ini
				  $("#content-chat-feed").append(response_bot(respond_bot, prob_val, get_time(new Date())));
				} else {
				  $("#content-chat-feed").append(response_bot("Maaf, Saya tidak mengerti, ada yang bisa saya bantu?", prob_val, get_time(new Date())));
				}
			  }
			// scroll bottom
			force_scroll_bottom();
			// set empty input
			$('#input-chat').val('');
		}
	}
	}

	// Force scrollbar to bottom
	function force_scroll_bottom(){
		const el = document.getElementById('content-chat-feed');
		if (el) {
			el.scrollTop = el.scrollHeight;
		}
	}

	// handle button function
	const handleButtonSend = () => {
		// compile chatbot brain.js
		run_chatbot();
	}

	// pressing Enter key
	const _handleKeyDown = (e) => {
		if (e.key === 'Enter') {
		    // compile chatbot brain.js
		    run_chatbot();
		}
	}
	  
    return (
		<div className="App">
			<div className="card-side">
				<Sidebar />
			</div>
			<div className="card d-flex flex-column vh-100 overflow-hidden">
				<Header />
				<div className="card-body" style={{overflowY:"scroll"}} id="content-chat-feed">
					<div className="containerbot">
						<img src={logobot} alt="Avatar" style={{width:"100%"}}/>
						<div className="row">
							<div className="col-sm-8 pt-1">Hi, selamat datang :)</div>
							<div className="col-sm-4 pt-1"><span className="time-right">{currentTime}</span></div>
						</div>
					</div>
				</div> 
				<div className="card-footer"> 
					<div className="input-group">
						<input type="text" className="form-control" id="input-chat" placeholder='Message Hermes' onKeyDown={_handleKeyDown} />
						<div className="input-group-append">
							<button className="btn btn-primary" type="button" onClick={handleButtonSend}><span style={{color: "black"}}><FiSend /></span></button>
						</div>
					</div>
					<p>Hermes AI may make mistakes and provide inaccurate information, for educational purposes see the source code in About Hermes.</p>
				</div>
			</div>
		</div>
    );
}

export default App;