# steembin - read-only steemit viewer in 8.7% of the bytes

On my first or second day of finding out **steem** and **steemit** existed, I ran to try to create something that could get me acquainted with the basic developer **API** (_Application Programming Interface_) of the **steem** network. I ended-up pushing [`steemcli`](https://github.com/yamadapc/steemcli) up, even though that wasn't really what I'd set to myself to build over those two afterwork programming sessions.

Initially I thought I'd build a custom themeable version of **steemit**, to fix what I didn't like in it, by scrapping all Ghost themes and making small modifications to them.

That actually is implemented but buggy; if you want to take it over **there're 140+ open-source ghost themes I think are perfectly legal to make available with proper attribution**. I'm not really eager to continue trying to do that, so I'm open-sourcing and announcing a less buggy version of that code-base, which simply is a lean read-only front-end for **steemit.com** running on heroku's free tier at [steembin.herokuapp.com](https://steembin.herokuapp.com/).

**Some screenshots:**
![](http://i.imgur.com/T2YhTUB.png)
![](http://i.imgur.com/TbNpNhJ.png)

I just thought it was funny that in the end, the hacky, old-fashioned, unsophisticated way of trying to build a little front-end as a regular web-application without doing a SPA was actually pretty good for me to navigate, even though it's a crappy script.

Check a [webpage test here](https://www.webpagetest.org/video/compare.php?tests=160928_FF_3A62,160928_GZ_3A64,160928_97_3A65), comparing **steembin** on Heroku's free tier against **steemit.com's** current React.js front-end.

[There's a neat little video here as well.](https://www.webpagetest.org/video/view.php?id=160928_f3387616fb9825c0c5d176736c28dd10cae4b8c7)

End of the day, I think the doing less work, sending less data, is still the way to go for optimising applications. **steemit** your JavaScript bundle is soo big!

Enjoy or mock the code on [GitLab](https://gitlab.com/beijaflor/steembin), published under the GPLv3 license. I'll probably give you full rights if you ask.

All the best, @yamadapc
