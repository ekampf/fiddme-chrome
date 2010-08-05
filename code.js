
		String.prototype.startsWith = function(str){
			return (this.indexOf(str) === 0);
		}

		var statusBoxID = "#status";
		var RTTag = "<li><span class='link'><span class='retweet-icon icon'></span><a class='old-Retweet-link' title='Old Retweet' href='#'>RT</a></span></li>";
		var DMTag = "<li><span class='link'><span class='reply-icon icon'></span><a class='DM-link' title='Send Direct Message' href='#'>DM</a></span></li>";
		var replyAllTag = "<li><span class='link'><span class='reply-icon icon'></span><a class='Reply-to-all-link' title='Reply to All' href='#'>Reply to all</a></span></li>";
		var switchDirTag = "<li><span class='link'><span style='background-image:url("+chrome.extension.getURL("icons/dir-icon.png")+")' class='reply-icon icon'></span><a class='Swich-dir-link' title='Switch Direction' href='#'>Switch</a></span></li>";
		var prevTweetTag = "<li><span class='link'><span style='background-image:url("+chrome.extension.getURL("icons/prev-tweet-icon.png")+")' class='prev-Tweet reply-icon icon'></span><a class='prev-Tweet' title='Load Previous Tweet' href='#'>PrevTweet</a></span></li>";
		var addLinkTag = "&nbsp;<a href='#' tabindex='4'  id='btnLink' title='shorten and add link' style='height:13px'><span>Add URL</span></a> &nbsp;";
		var username = null;
		
		//getting the username
		username = $("meta[name=session-user-screen_name]:first").attr("content");
		
		if ($("#btnLink").length==0){
			$(addLinkTag).prependTo("#tweeting_controls");
		}
		
		$("#btnLink").click(function()
		{
			 var longUrl = prompt("Enter the URL you want to shorten:","");
			 //alert(longUrl);
			 if (longUrl == null)
				return false;
			 $("#loader").show();
			 chrome.extension.sendRequest({app:"twt",url:longUrl}, function(response) {
				//alert(response.result);
				$("#loader").hide();
				$(statusBoxID).val($(statusBoxID).val() + response.result);
			});
			 return false;
		});
		
		
		//to show the icons before the interval
		setRT();
		//start timer
		//setInterval("setRT()",3500);
		
		function setRT()
		{
			
			$(".hentry").each(function(){
				if ($(this).find("a.old-Retweet-link").length<=0) {
					$(this).find(".actions-hover").css("background-color","#F7F7F7");
					
					/*
					Fiddme preview
					*/
					
					// Look for fiddme url
					fiddmeTag = "<span class='entry-content-fiddme' style='float: right;'><img src='$thumb$' /></span>"
					$(this).find(".web").each(function(index, elm){
						href = $(elm).attr("href");
						is_fiddme = href.startsWith("http://fidd.me/");
						if (is_fiddme) {
							status_content = $(elm).parent().parent();
							status_content.wrapInner("<div style='width:500px;' />")
							status_content.find('.entry-content').before(fiddmeTag.replace('$thumb$', href + '/thumb'));
							status_content.find('.entry-content').after('<br style="clear:both;">');
						}
					})
					
					/*
					RT Tag
					*/
					/*
					$(this).find(".actions-hover").append(RTTag);
					$(".old-Retweet-link").unbind();
					$(".old-Retweet-link").bind("click",
						function(){
							var tweet = $(this).parent().parent().parent().parent();
							var screenName = tweet.find(".screen-name:first").text();
							if (screenName == '')
								screenName = $(".screen-name:first").text()
								
							var tweetext = "RT @"+ screenName +": "+ tweet.find(".entry-content:first").text();
							if ($(statusBoxID).length)
							{
								$(statusBoxID).val(tweetext);
								$(statusBoxID).focus();
							}
							else
							{
								window.location = '/?status='+tweetext;
							}
							return false;
						});
					*/
					
					/*
					Reply to all Button
					*/
					/*

					$(this).find(".actions-hover").append(replyAllTag);
					$(".Reply-to-all-link").unbind();
					$(".Reply-to-all-link").bind("click",
						function(){
							var tweet = $(this).parent().parent().parent().parent();
							var screenName = tweet.find(".screen-name:first").text();
							if (screenName == '')
								screenName = $(".screen-name:first").text()
							
							var accounts = "@"+ screenName +" ";
							accounts += tweet.find(".entry-content:first").text().match(/@[a-zA-Z0-9_]{1,20}/g);
							accounts = accounts.toString().replace(","," ");
							accounts = accounts.replace("null","");
							//alert(accounts);
							if ($(statusBoxID).length)
							{
								$(statusBoxID).val(accounts);
								$(statusBoxID).focus();
							}
							else
							{
								window.location = '/?status='+accounts;
							}
							return false;
						});
						
					*/
					/*
					DM Button
					*/
					/*
					$(this).find(".actions-hover").append(DMTag);
					$(".DM-link").unbind();
					$(".DM-link").bind("click",
						function(){
							var tweet = $(this).parent().parent().parent().parent();
							var screenName = tweet.find(".screen-name:first").text();
							if (screenName == '')
								screenName = $(".screen-name:first").text()
							var tweetext = "DM "+ screenName;
							if ($(statusBoxID).length)
							{
								$(statusBoxID).val(tweetext);
								$(statusBoxID).focus();
							}
							else
							{
								window.location = '/?status='+tweetext;
							}
							return false;
						});
					*/
					/*
					Load Prev Tweet Button
					*/
					/*
					if ($(this).find(".entry-meta").find("a:last").text().indexOf("reply")>0){
					var tweetUrl = $(this).find(".entry-meta").find("a:last").attr("href");
					var currPrevTweetTag = prevTweetTag;
					currPrevTweetTag = currPrevTweetTag.replace("#",tweetUrl);
					$(this).find(".actions-hover").append(currPrevTweetTag);
					
					$(".prev-Tweet").unbind();
					$(".prev-Tweet").bind("click",
						function(){
							try{
							
							var tweet = $(this).parent().parent().parent().parent();
							//$("#loader").show();
							tweet.append("<div class='loading-tweet'><img src='"+chrome.extension.getURL("icons/load.gif")+"' alt='loading'/></div>")
							//var tweetUrl =  tweet.find(".entry-meta").find("a:last").attr("href");
							//tweet.find(".entry-meta").find("a:last").hide();
							//alert(tweetUrl);
							tweetUrl = tweet.find("a.prev-Tweet").attr("href");
							$.ajax({
								url: tweetUrl,
								error: function(data)
								{
									tweet.find(".loading-tweet").remove();
									//tweet.append("<div class='prev-tweet-div'>Profile Protected</div>");
									alert("Sorry, tweet is protected");
									
								},
								success: function(data) {
									//alert(data);
									$(".result").html(data); 
									var userNameRP = $(data).find(".screen-name");
									var reply = $(data).find(".status-body");
									var thumb = $(data).find(".thumb");
									thumb.css("float","left");
									thumb.find("img:first").attr("width","48");
									thumb.find("img:first").attr("height","48");
									userNameRP =  userNameRP.html();
									//alert(reply.html());
									$(reply).find("ul.actions-hover").empty();
									
									//alert(html)
									//alert(reply.find(".entry-meta").find("a:last").text());
									if (reply.find(".entry-meta").find("a:last").text().indexOf("reply")>0){
										tweet.find("a.prev-Tweet").attr("href",reply.find(".entry-meta").find("a:last").attr("href"));
									}
									else
									{
										tweet.find(".prev-Tweet").parent().hide();
									}
									tweet.find(".loading-tweet").remove();
									tweet.append("<div class='prev-tweet-div' style='disply:none;height:50px;'>"+thumb.html()+"<div style='width:370px;float:right'><strong><a class='tweet-url screen-name' href='http://twitter.com/"+
										userNameRP+"'>"+userNameRP+"</a></strong>"+
										reply.html()+"</div></div><div style='clear:both'></div>");
									tweet.find(".prev-tweet-div").fadeIn("slow");
									$("#loader").hide();
									
								}
								});
							}catch(err)
							{
								alert(err);
							}
							return false;
						});
						}
					*/
					/*
					Switch Direction Button
					*/
					/*
					$(this).find(".actions-hover").append(switchDirTag);
					$(".Swich-dir-link").unbind();
					$(".Swich-dir-link").bind("click",
						function(){
							var tweet = $(this).parent().parent().parent().parent();
							if (tweet.find(".entry-content").css("display") != "block"){
								tweet.find(".entry-content").css("display","block");
								tweet.find(".entry-content").css("direction","rtl");
								tweet.find(".entry-content").css("text-align","right");
							}else
							{
								tweet.find(".entry-content").css("display","");
								tweet.find(".entry-content").css("direction","");
								tweet.find(".entry-content").css("text-align","");
							}
							return false;
					});
					*/
					
				}//end if 
				
				//highlight user mentions
				if ($(this).find(".entry-content").text().indexOf("@"+username)>=0)
				{
						//$(this).css("background-color","#FFFF99");FFFFCC
						$(this).css("background-color","#FFFFCC"); 
				}
					
				
				
			});
		}
		
		
		
		
		
		