class Metronome {
  constructor(context) {
    this.context = context;
    this.isPlaying = false;
    this.current16thNote = 0;
    this.tempo = 60;
    this.lookahead = 25.0;
    this.scheduleAheadTime = 0.1;
    this.nextNoteTime = 0.0;
    this.timerID = null;
  }

  nextNote() {
    const secondsPerBeat = 60.0 / this.tempo;
    this.nextNoteTime += 0.25 * secondsPerBeat;
    this.current16thNote++;
    if (this.current16thNote === 16) {
      this.current16thNote = 0;
    }
  }

  scheduleNote(beatNumber, time) {
    const osc = this.context.createOscillator();
    const envelope = this.context.createGain();
    osc.frequency.value = beatNumber % 4 === 0 ? 1000 : 800;
    envelope.gain.value = 1;
    envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
    osc.connect(envelope);
    envelope.connect(this.context.destination);
    osc.start(time);
    osc.stop(time + 0.2);
  }

  scheduler() {
    console.log(this.nextNoteTime);
    console.log(this.context.currentTime);
    console.log(this.scheduleAheadTime);
    while (
      this.nextNoteTime <
      this.context.currentTime + this.scheduleAheadTime
    ) {
      this.scheduleNote(this.current16thNote, this.nextNoteTime);
      this.nextNote();
    }
    this.timerID = setTimeout(this.scheduler.bind(this), this.lookahead);
  }

  start() {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.current16thNote = 0;
      this.nextNoteTime = this.context.currentTime;
      this.scheduler();
    }
  }

  stop() {
    this.isPlaying = false;
    clearTimeout(this.timerID);
  }

  setTempo(newTempo) {
    this.tempo = newTempo;
  }
}
