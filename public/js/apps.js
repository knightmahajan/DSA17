		moment().format();
		var app = new Vue({
		  el: '#app',
		  data: {
		  	currentMonth:moment().format("MMM"),   //we are using this instead of moment object to let vue, know something has chaned, or else it wont react to chnages in moment object
		  	currentYear:moment().format("YYYY"),
		  	realtoday:moment(),
		  	selectedEvent:'',
			newz:[],
		    events:[]
		  	},
		  computed:{
		  	daysInMonth:function(){
		  		return this.currentContext().daysInMonth();
		  	},
		  	firstemptyDays:function(){
		  		return this.currentContext().date(1).day();
		  	},
		  	lastemptyDays:function(){
				return 7-this.currentContext().endOf("month").day();		  		
		  	},
		  	eventsThisMonth:function(){
		  		var that = this;
			  		var newEvents = this.events.map(function(event){
			  			event.date = moment(event.date,"YYYY-MM-DD");
			  			if(event.date.format("MMM")==that.currentMonth && event.date.year()==that.currentYear){
			  				return event;
			  			}
			  		});
			  		var eventsThisMonth={}
			  		newEvents.forEach(function(event){
			  			if(event){
				  			eventsThisMonth[event.date.date()] = event;
			  			}
			  		})
			  		return eventsThisMonth;
		  	}
		  },
		  methods:{
		  	prevMonth:function(){
		  		this.currentYear = this.currentContext().add(-1,'month').format("YYYY");
		  		this.currentMonth = this.currentContext().add(-1,'month').format("MMM");
		  		console.log(this.currentMonth+this.currentYear);
		  	},
		  	nextMonth:function(){
		  		this.currentYear = this.currentContext().add(1,'month').format("YYYY");
		  		this.currentMonth = this.currentContext().add(1,'month').format("MMM");
		  		console.log(this.currentMonth+this.currentYear);
		  	},
		  	currentContext:function(){
		  		return moment(this.currentMonth+this.currentYear,"MMMYYYY")
		  	}
		  },
		  created:function(){
		  	var that=this
		  	axios.get('http://srmdsa.org/api/events').then(function(resp){
	  			that.events = resp.data;
		  		axios.get('http://srmdsa.org/api/news').then(function(resp){
			  		that.newz = resp.data;
				  	that.selectedEvent = that.events[0];
				  		$(document).ready(function(){
				  		  $('.ui.cards').slick({
				  		    infinite:true,
				  		    slidesToShow: 3,
				  	        slidesToScroll: 3,
				  	        dots:true,
				  	        autoplay:true,
				  	        varibleWidth:true,
				  	        responsive: [
				  	            {
				  	              breakpoint: 1024,
				  	              settings: {
				  	                slidesToShow: 3,
				  	                slidesToScroll: 3,
				  	                infinite: true,
				  	                dots: true
				  	              }
				  	            },
				  	            {
				  	              breakpoint: 600,
				  	              settings: {
				  	                slidesToShow: 1,
				  	                slidesToScroll: 1
				  	              }
				  	            },
				  	            {
				  	              breakpoint: 480,
				  	              settings: {
				  	                slidesToShow: 1,
				  	                slidesToScroll: 1
				  	              }
				  	            }
				  	        ]
				  		  });
				  		});
		  		});
		  	});
		  }
		});