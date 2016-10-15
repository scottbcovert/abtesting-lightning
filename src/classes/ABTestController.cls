/**
* @author Scott Covert
* @date 10/13/2016
* @description A/B Test Controller
*/

public with sharing class ABTestController {

    /**
	* @author Scott Covert
	* @date 10/13/2016
	* @description
	* @param List List of A/B experiment names to run
	* @param String JSON string representation of a mapping of experiment name by list of possible alternatives
	* @param String JSON string representation of a mapping of experiment name by forced result to be returned from the corresponding array of possible alternatives-recommended for testing only as participation will not be recorded
	* @param List Traffic percentages each specified A/B experiment should be exposed to, all other visitors will receive the experiments' corresponding control value
	* @param String Unique id for the client participating in each specified A/B experiment
	* @param String UserAgent, used for bot detection
	* @return List List of A/B test experiment results
	*/
    @AuraEnabled
    public static Object runABTest(List<String> experiment, String alternatives, String forcedResult, List<Decimal> trafficFraction, String clientId, String userAgent) {
        // Callout
        // Instantiate a new http object
        Http h = new Http();
        // Instantiate a new HTTP request, specify the method (GET) as well as the endpoint
        HttpRequest req = new HttpRequest();
        Map<String,Object> alternativesMapping = (Map<String,Object>) JSON.deserializeUntyped(alternatives.replace('\'','\"'));
        List<Object> expAlternatives = (List<Object>)alternativesMapping.get(experiment[0]);
        String endpointUrl = 'https://abtest-staging.sf1spark.com:5000/participate?experiment='+experiment[0]+'&alternatives='+String.valueOf(expAlternatives[0])+'&alternatives='+String.valueOf(expAlternatives[1])+'&client_id='+clientId;
        if (forcedResult!=null && forcedResult!='')
        {
            Map<String,Object> forcedResultsMapping = (Map<String,Object>) JSON.deserializeUntyped(forcedResult.replace('\'','\"'));
            endpointUrl += '&force='+String.valueOf(forcedResultsMapping.get(experiment[0]));
        }
        req.setEndpoint(endpointUrl);
        req.setMethod('GET');
        // Send the request, and return a response
        HttpResponse res = h.send(req);
        Map<String,Object> responseBodyObject = (Map<String,Object>) JSON.deserializeUntyped(res.getBody());
        Map<String,Object> responseMapping = (Map<String,Object>)responseBodyObject.get('alternative');
        return responseMapping.get('name');
    }


    /**
	* @author Scott Covert
	* @date 10/13/2016
	* @description
	* @param List A list of experiments to be marked as converted
	* @param String Converted client id
	*/
    @AuraEnabled
    public static void convertABTest(List<String> experiment, String clientId) {
        // Callout
        // Instantiate a new http object
        Http h = new Http();
        // Instantiate a new HTTP request, specify the method (GET) as well as the endpoint
        HttpRequest req = new HttpRequest();
        req.setEndpoint('https://abtest-staging.sf1spark.com:5000 /convert?experiment='+experiment[0]+'&client_id='+clientId);
        req.setMethod('GET');
        // Send the request, and return a response
        HttpResponse res = h.send(req);
    }
}