const q = document.querySelector('#q');
const resultList = document.querySelector('#results');

const keyup$ = Rx.Observable.fromEvent(q, 'keyup')
  .map(e => e.target.value)
  .filter(text => text.length > 2)
  .throttle(750)
  .distinctUntilChanged();

keyup$
  .do(() => q.classList.add('spinner'))
  .flatMapLatest(term => {
    const url = 'http://en.wikipedia.org/w/api.php?action=opensearch'
      + '&format=json'
      + '&search=' + term
      + '&callback=JSONPCallback';
    return Rx.DOM.jsonpRequest(url)
  })
  .do(() => q.classList.remove('spinner'))
  .map(r => r.response[1])
  .map(results => results.reduce((html, result) => `${html}<li>${result}</li>`, ''))
  .subscribe(
    (resultsHTML) => resultList.innerHTML = resultsHTML,
    (err) => console.error(err)
  );
