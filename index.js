function App() {
  const [displayTime, setDisplayTime] = React.useState(5);
  const [breakTime, setBreakTime] = React.useState(3);
  const [sessionTime, setSessionTime] = React.useState(5);
  const [timeOn, setTimeOn] = React.useState(false);
  const [onBreak, setOnBreak] = React.useState(false);
  const [breakAudio, setBreakAudio] = React.useState(
    new Audio("./assets/beep.mp3")
  );

  const playSound = () => {
    breakAudio.currentTime = 0;
    breakAudio.play();
  };

  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return (
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds)
    );
  };

  const changeTime = (amount, type) => {
    if (type == "break") {
      if (breakTime <= 0 && amount < 0) {
        return;
      }
      setBreakTime((prev) => prev + amount);
    } else {
      if (breakTime <= 0 && amount < 0) {
        return;
      }
      setSessionTime((prev) => prev + amount);
      if (!timeOn) {
        setDisplayTime(sessionTime + amount);
      }
    }
  };

  const controlTime = () => {
    let second = 1000;
    let date = new Date().getTime();
    let nextDate = new Date().getTime() + second;
    let onBreakVariable = onBreak;

    if (!timeOn) {
      let interval = setInterval(() => {
        date = new Date().getTime();
        if (date > nextDate) {
          setDisplayTime((prev) => {
            if (prev <= 0 && !onBreakVariable) {
              playSound();
              onBreakVariable = true;
              setOnBreak(true);
              return breakTime;
            } else if (prev <= 0 && onBreakVariable) {
              playSound();
              onBreakVariable = false;
              setOnBreak(false);
              return sessionTime;
            }
            return prev - 1;
          });
          nextDate += second;
        }
      }, 30);
      localStorage.clear();
      localStorage.setItem("interval-id", interval);
    }

    if (timeOn) {
      clearInterval(localStorage.getItem("interval-id"));
    }
    setTimeOn(!timeOn);
  };

  const resetTime = () => {
    setDisplayTime(25 * 60);
    setBreakTime(5 * 60);
    setSessionTime(25 * 60);
  };

  return (
    <div className="container">
      <div id="card">
        <p>{onBreak ? "Break" : "Session"}</p>
        <p id="time">{formatTime(displayTime)}</p>
        <div id="controls">
          <img
            onClick={() => controlTime()}
            src={!timeOn ? "assets/play.svg" : "assets/pause.svg"}
            alt=""
            id="imgPlay"
          />
          <img
            onClick={() => resetTime()}
            src="assets/restart.svg"
            id="imgRestart"
          />
        </div>

        <div id="configuration">
          <div className="col">
            <p>BREAK LENGTH</p>
            <Length
              changeTime={changeTime}
              type={"break"}
              time={breakTime}
              formatTime={formatTime}
            />
          </div>
          <div className="col">
            <p>SESSION LENGTH</p>
            <Length
              changeTime={changeTime}
              type={"session"}
              time={sessionTime}
              formatTime={formatTime}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Length({ changeTime, type, time, formatTime }) {
  return (
    <div className="conf">
      <img
        onClick={() => changeTime(-60, type)}
        id="minusBreak"
        src="assets/minus.svg"
      />
      <p id="counterBreak">{formatTime(time)}</p>
      <img
        onClick={() => changeTime(60, type)}
        id="plusBreak"
        src="assets/plus.svg"
      />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
