USAGE
------

1) Include the sequence.js and sequence.css files in your html page


2) Initialize sequence with the id of the div/any html element which is going to be modified by some library.


3) Additionally an option is param can be passed with option to set timeout interval in milliseconds(default is 3 secs)
    
      var seq = new Sequence("seqDiv", {interval:2000}); // id of the div that will be modified by your library
      var mylib = some_library("seqDiv");
    
4) Add the sequences that need to be performed. The following is that template that needs to be followed. 

    seq.registerEvent("Some Message for the Sequence" , function() {
        // any operation of your library
        mylib.dosomething();
    }, this);


    // adding the second thing that needs to be done
    
    seq.registerEvent("Some Message again", function() {
      //do something else 
      mylib.dosomethingelse();
    }, this);

5) Run the sequence on click of a button or whenever needed.

    $("#somebutton").on("click", function() {
      seq.run();
    });
    
Examples folder contain an example of using my library StepsJS using SequenceJS
