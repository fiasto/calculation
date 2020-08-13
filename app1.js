
// BUDGET CONTROLLER
var budgetVar = (function(){

  var Income=function(id,discription,value) {
      this.id=id;
      this.discription=discription;
      this.value=value;
  };

  var Expensive=function(id,discription,value) {
    this.id=id;
    this.discription=discription;
    this.value=value;
    this.percentage=-1;
  };

  Expensive.prototype.calcPercentages = function(totalIncomes){
      if (data.totals.inc > 0){
        this.percentage=Math.round((this.value/totalIncomes)*100);
      }else{
          this.percentage=-1;
      }
  };

  Expensive.prototype.getPercentages=function(){
      return this.percentage;
  };


var calculateTotal=function(type){
    var sum=0;
    data.allItems[type].forEach(function(cur){
        sum += cur.value;
    });
    
    data.totals[type]=sum;
    
    
};
var data={
    allItems:{
        inc:[],
        exp:[]
    },
    totals:{
        inc:0,
        exp:0
    },
    budget:0,
    percentage:0
    
};

return{
    addItem:function(type,dis,val){
        var newItem, ID;
        if(data.allItems[type].length>0){
            ID=data.allItems[type][data.allItems[type].length-1].id+1;
        }else{
            ID=0;
        }
        
        if(type==="inc"){
            newItem=new Income(ID,dis,val);
        }else if(type==="exp"){
            newItem=new Expensive(ID,dis,val);
        }
        data.allItems[type].push(newItem);
        return newItem;
    },
    deleteItem:function(type,id){
        var ids,index;
        ids = data.allItems[type].map(function(current){
               return current.id
        });
        index = ids.indexOf(id);

        if(index !== -1){
            data.allItems[type].splice(index,1);
        }
    },
    updateBudget:function(){
        calculateTotal("inc");
        calculateTotal("exp");
        data.budget=data.totals.inc-data.totals.exp;
        if(data.totals.inc >0){
            data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);
        }else{
            data.percentage= -1;
        }
    },

    calculatePercentages:function(){

        data.allItems.exp.forEach(function(cur){
            cur.calcPercentages(data.totals.inc);
        });
    },

    getPercentages:function(){
        var perc = data.allItems.exp.map(function(cur){
            return cur.getPercentages();
        });
        return perc;
    },


    getBudget:function(){
        return{
            budget:data.budget,
            percentage:data.percentage,
            totalInc:data.totals.inc,
            totalsExp:data.totals.exp
        }
    },
    testing:function(){
        console.log(data);
    }
    
};
}) ();



// UI CONTROLLER
var uiVar  =(function(){
   var DOMstrings={
       inputType:".add__type",
       inputDiscription:".add__description",
       inputValue:".add__value",
       incomeContainer:".income__list",
       expenseContainer:".expenses__list",
       budgetLabel:".budget__value",
       incomeLabel:".budget__income--value",
       expenseLabel:".budget__expenses--value",
       percentageLabel:".budget__expenses--percentage",
       container:".container",
       displayPercLabel:".item__percentage"
   };


   var formatNumber = function(num,type){
    var num, int, dec;
    // put +ve or -ve sign

    //put that '.' decimal number 2000.982 like 2000.98

    //put ','in 2000.98 like 2,000.98

    num=Math.abs(num);
    num=num.toFixed(2);

    numSplit=num.split(".");
    int=numSplit[0];
    if(int.length>0){
        int=int.substr(0,int.length-3)+","+int.substr(int.length-3,3);  //23456=(0,5-3=2)+','+(2,3)=23,456.
    }
    dec=numSplit[1];
    return (type === "inc" ? "+" : "-") +" " + int +"." + dec ;
   };
   

    return{
        getInput:function(){
            return{
                type:document.querySelector(DOMstrings.inputType).value,   //"inc" or "exp"
                discription:document.querySelector(DOMstrings.inputDiscription).value,
                value:parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
           
        },

        addListItems:function(obj,type){
            var html,element,newhtml;
            if(type==="inc"){
                element=DOMstrings.incomeContainer;
                html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if(type==="exp"){
                element=DOMstrings.expenseContainer;
                html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            newhtml=html.replace("%id%",obj.id);
            newhtml=newhtml.replace("%description%",obj.discription);
            newhtml=newhtml.replace("%value%", formatNumber(obj.value,type)); 
            document.querySelector(element).insertAdjacentHTML("beforeend",newhtml);
        },
        deleteListItems:function(selectorID){
            var el;
            el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        clearFields:function(){
            var fields,fieldsArr;
            fields=document.querySelectorAll(DOMstrings.inputDiscription +","+ DOMstrings.inputValue);
            fieldsArr=Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(current,index,Array){
                current.value="";
            });

            fieldsArr[0].focus();
        },
        displayBudget:function(obj){
            var type;
            obj.budget > 0 ? type = "inc" : type = "exp";

            document.querySelector(DOMstrings.budgetLabel).textContent=formatNumber(obj.budget,type);
            document.querySelector(DOMstrings.incomeLabel).textContent=formatNumber(obj.totalInc,"inc");
            document.querySelector(DOMstrings.expenseLabel).textContent=formatNumber(obj.totalsExp,"exp");
            if(obj.percentage>0){
                document.querySelector(DOMstrings.percentageLabel).textContent=obj.percentage + "%";
            }else{
                document.querySelector(DOMstrings.percentageLabel).textContent= "--%";
            }
            
        },


        displayPercentages:function(percentage){
            var fields=document.querySelectorAll(DOMstrings.displayPercLabel);

            var nodeListForPercentages = function(list,callback){
                for(var i=0 ; i<list.length ; i++){
                    callback(list[i] , i);
                }
            };

            nodeListForPercentages(fields, function(current,index){

                if(percentage[index] > 0){
                    current.textContent = percentage[index]+"%";
                }else{
                    current.textContent = "----";
                }
                 
            });
        },
        


        getDomstrings:function(){
            return DOMstrings;
        }
        
    };
})();



// GLOBEL CONTROLLER
var controllerVar= (function(bugtVar,userVar){

    var setupEventListener=function(){
        var DOM;
        DOM=userVar.getDomstrings();
        document.querySelector(".add__btn").addEventListener("click",addNewItems);
        document.addEventListener("keypress",function(event){
        if(event.keyCode===13 || event.which===13){
            addNewItems();
        }
        });
        document.querySelector(DOM.container).addEventListener("click",ctrlDeleteItem);
    };

    var calculateBudget=function(){
        var budget;

        //CALCULATE THE BUDGET
        bugtVar.updateBudget();

        //return the Budget
        budget=bugtVar.getBudget();
        

        //UPDATE THE BUDGET UI
        userVar.displayBudget(budget);
    };

    var calculatePercentages=function(){

      //calculate  percentages
      bugtVar.calculatePercentages();

      //read the calaculated percentages
      var percentage = bugtVar.getPercentages();
       
      //DISPLAY IN USER INTERFACE
      userVar.displayPercentages(percentage);
    };
    
    var addNewItems=function(){
        var input,newItem;
         //GET DATA FROM ENTERED FIELD
         input=userVar.getInput();

         //add incomes and expenses in user interface
           if(input.discription !=="" && !isNaN(input.value) && input.value>0){
            newItem=bugtVar.addItem(input.type,input.discription,input.value);
            userVar.addListItems(newItem,input.type);

            //clear input fields
            userVar.clearFields();

            // UPDATE BUDGET
            calculateBudget();

            //CALCULATE AND UPDATE PERCENTAGES
            calculatePercentages();
         }
    };
    var ctrlDeleteItem = function(event){
        var itemID,type,ID;

        itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID){
            splitID = itemID.split("-");
            type = splitID[0];
            ID = parseFloat(splitID[1]);
            
            //DELETE ITEMS IN DATASTRUCTURE
            bugtVar.deleteItem(type,ID);

            //DELETE IN USER INTERFACE
            userVar.deleteListItems(itemID);

            //UPDATE BUDGET
            calculateBudget();

            //CALCULATE AND UPDATE PERCENTAGES
            calculatePercentages();

        }
    };
    return{
        init:function(){
            userVar.displayBudget({
                budgetLabel:0,
                incomeLabel:0,
                expenseLabel:0,
                percentageLabel:-1
            })
            
            setupEventListener();
        }
    }
    

})(budgetVar,uiVar);

controllerVar.init();