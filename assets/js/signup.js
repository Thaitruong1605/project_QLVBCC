$(document).ready( async function(){
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    $('#account_address').attr('value', accounts);
})