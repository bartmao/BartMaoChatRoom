interface Window{
    webkitAudioContext:AudioContext;
    AudioContext:AudioContext;

    webkitURL:URL
}

interface AudioContext{
    createMediaStreamSource(MediaStream): MediaElementAudioSourceNode;
    createJavaScriptNode(bufferSize?: number, numberOfInputChannels?: number, numberOfOutputChannels?: number): ScriptProcessorNode;
}

interface windows extends Window{}