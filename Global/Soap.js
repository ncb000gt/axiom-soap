/*
 * Axiom License Notice
 *
 * <Place Holder>
 *
 * @author: Nick Campbell (Siteworx, Inc.)
 */

if (!global.axiom) {
    global.axiom = {};
}

axiom.Soap = function() {
    var DOMParser = Packages.axiom.scripting.rhino.extensions.DOMParser;

    var soapfactory = Packages.javax.xml.soap.SOAPConnectionFactory.newInstance();
    var connection = soapfactory.createConnection();
    var messagefactory = Packages.javax.xml.soap.MessageFactory.newInstance();
    var message = messagefactory.createMessage();
    var headers = message.getMimeHeaders();
    var soappart = message.getSOAPPart();
    var soapenvelope = soappart.getEnvelope();
    var body = soapenvelope.getBody();
    var reply = null;
    var debug = false;

    this.addNamespaceToEnvelope = function(prefix, uri) {
	soapenvelope.addNamespaceDeclaration(prefix, uri);
    }
    
    this.setEncodingToEnvelope = function(uri) {
	soapenvelope.setEncodingStyle(uri);
    }

    this.addHeader = function(key, value) {
	headers.addHeader(key, value);
    }

    //for .Net Webservices support
    this.setSoapAction = function(soapaction) {
	headers.addHeader("SOAPAction", soapaction);
    }

    this.setBody = function(bodydata) {
	if (bodydata instanceof XML || bodydata instanceof XMLList) {
	    setBodyToXML(bodydata);
	}
	//TODO: Check other data types.
    }

    function setBodyToXML(bodydata) {
	try {
	    var doc = DOMParser.parseXml(bodydata.toXMLString());
	    body.addDocument(doc);
	} catch (e) {
	    throw e;
	}
    }
    
    this.getBody = function() {
	return body;
    }

    this.saveChanges = function() {
	message.saveChanges();
    }

    this.callService = function(url) {
	reply = connection.call(message, url);
	return reply;
    }
    
    this.getReply = function() {
	return reply;
    }
    
    this.getReplyBody = function() {
	return reply.getSOAPPart().getEnvelope().getBody();
    }

    this.getReplyBodyAsDocument = function() {
	return reply.getSOAPPart().getEnvelope().getBody().extractContentAsDocument();
    }
    
    this.close = function() {
	connection.close();
    }

    for (var i in this)
        this.dontEnum(i);

    return this;
}

axiom.Soap.toString = function() {
    return "[axiom.Soap]";
}

axiom.Soap.prototype.toString = function() {
    return "[axiom.Soap Object]";
}

axiom.lib = "Soap";
axiom.dontEnum(axiom.lib);
for (var i in axiom[axiom.lib])
    axiom[axiom.lib].dontEnum(i);
for (var i in axiom[axiom.lib].prototype)
    axiom[axiom.lib].prototype.dontEnum(i);
delete axiom.lib;
