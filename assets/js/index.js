const synth = window.speechSynthesis

const textArea = document.getElementById('textToSpeak')
const pitch = document.querySelector('#pitch')
const rate = document.querySelector('#rate')
const voiceSelector = document.querySelector('select')

let voices = []


navigator.permissions.query({ name: 'microphone' })
  .then(({ state }) => {
    if(state === 'granted') {
      console.log('Have acces to the microphone.', state)
    } else {
      console.log('Request access to the microphone.', state)
    }
  })

navigator.mediaDevices.getUserMedia({ audio: true })
  .then((stream) => {
    let audioMp3 = new MediaRecorder(stream)
    console.log(stream)
  })

const populateVoiceList = () => {
  voices = synth.getVoices()

  voices.map((voice) => {
    let option = document.createElement('option')
    option.textContent = voice.name + ' (' + voice.lang

    if(voice.default) {
      option.textContent += ' -- DEFAULT'
    }

    option.setAttribute('data-lang', voice.lang)
    option.setAttribute('data-name', voice.name)

    voiceSelector.appendChild(option)
  })
}

populateVoiceList()

if(speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList
}

const textToSpeech = () => {
  const utterThis = new SpeechSynthesisUtterance(textArea.value)
  const selectedOption = voiceSelector.selectedOptions[0].getAttribute('data-name')

  if(!selectedOption || !textArea.value){
    textArea.style.border = 'solid red 1px'
    voiceSelector.style.border = 'solid red 1px'
    console.log('You need to enter valid values.')
  } else {
    textArea.style.border = 'none'
    voiceSelector.style.border = 'none'
    voices.map((voice) => {
      if(voice.name === selectedOption) {
        utterThis.voice = voice
        utterThis.lang = voice.lang
      }
    })
    console.log(utterThis)
    utterThis.pitch = pitch.value
    utterThis.rate = rate.value
    synth.speak(utterThis)

    
    textArea.blur()
  }
}
