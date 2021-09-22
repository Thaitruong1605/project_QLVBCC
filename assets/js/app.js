App = {
  web3Provider: null,
  contracts: {},
  network: '',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('/abis/System.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var SystemArtifact = data;
      App.contracts.System = TruffleContract(SystemArtifact);
    
      // Set the provider for our contract
      App.contracts.System.setProvider(App.web3Provider);
    
      // Use our contract to retrieve and mark the adopted pets
      return App.getAddress();
    });
  },
  getAddress: function() {
    var systemInstance;
    App.contracts.System.deployed().then(function(instance) {
      systemInstance = instance;
      return instance.address
    }).then(function(address) {
      contractAddress = address;
      console.log("contract: "+address);
    }).catch(function(err) {
      console.log(err.message);
    });
  },
}

$(function() {
  $(window).on('load',function() {
    App.init();
    console.log("account: "+web3.eth.accounts[0]);
  });
});
