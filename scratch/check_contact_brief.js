const http = require('http');

http.get('http://localhost/1928/api.php?action=get_all', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const json = JSON.parse(data);
    const cb = json.data.contactBrief;
    console.log('step4:', cb ? cb.step4 : 'None');
    console.log('step3:', cb ? cb.step3 : 'None');
  });
});
