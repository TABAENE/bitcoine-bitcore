console.log('\n');
//delete global._bitcore;
var bitcore = require('bitcore-lib');
delete global._bitcore;
var privateKeyWIF = 'cQhYXXNh5KQuJZBjkqS8kRWBSxUUrcGjoQtD2hXbTWKA2Q9riXEn'
var privateKey = bitcore.PrivateKey.fromWIF(privateKeyWIF);
var address = privateKey.toAddress();
//console.log('Address:');
//console.log(address);

var value = new Buffer('this a way to generate an address from a string--risky--not random--guessable!!!');
var hash = bitcore.crypto.Hash.sha256(value);
var bn = bitcore.crypto.BN.fromBuffer(hash);
var address2 = new bitcore.PrivateKey(bn, 'testnet').toAddress();
console.log('Address2:');
console.log(address2);

var Insight = require('bitcore-explorers').Insight;
var insight = new Insight('testnet');

insight.getUnspentUtxos(address, function(err, utxos){
	if (err){
		//Handel error
	}
	else{
		console.log(utxos);
		var tx = bitcore.Transaction();
		tx.from(utxos);
		tx.to(address2, 10000);
		tx.change(address);
		tx.fee(50000);
		tx.sign(privateKey);
		console.log('transaction:');
		console.log(tx.toObject());
		tx.serialize();
		
		//var scriptIn = bitcore.Script(tx.toObject().inputs[0].script);
		//console.log('input script string:');
		//console.log(scriptIn.toString());

                //var scriptOut = bitcore.Script(tx.toObject().outputs[0].script);
                //console.log('output script string:');
                //console.log(scriptOut.toString());

		insight.broadcast(tx.toString(), function(err, returnedTxId){
			if (err){
				console.log(err);
			}
			else{
				console.log('successfull broadcast: '+ returnedTxId);
			}
		});

	}
});
