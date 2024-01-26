$(document).ready(function() {
    var peopleData = [
        { name: "John Lennon", startYear: 1940, endYear: 1980 },
        { name: "Paul McCartney", startYear: 1942, endYear: 2024 },
        { name: "George Harrison", startYear: 1943, endYear: 2001 },
        { name: "Ringo Starr", startYear: 1940, endYear: 2024 },
        { name: "The Beatles", startYear: 1960, endYear: 1970 }
    ];

    var eventData = [
        { name: "Apollo Moon Landing", year: 1969 },
        { name: "End of World War II", year: 1945 },
        { name: "Apple Inc. Founded", year: 1976 },
        { name: "Dissolution of the Soviet Union", year: 1991 },
        { name: "Release of Rubber Soul", year: 1965 },
        { name: "Death of John Lennon", year: 1980 }
    ];

    var elements = [];
    var velocities = [];
    var positions = [];
    var isAnimating = true;
    var isElementActive = false; 
    var normalSpeed = 0.7;
    var slowedSpeed = 0.2; 

    function generateUniquePosition() {
        while (true) {
            var potentialPos = {
                x: Math.random() * ($(window).width() - 100),
                y: Math.random() * ($(window).height() - 100)
            };

            var isOverlapping = positions.some(function(pos) {
                return Math.abs(pos.x - potentialPos.x) < 100 && Math.abs(pos.y - potentialPos.y) < 100;
            });

            if (!isOverlapping) {
                return potentialPos;
            }
        }
    }

    function toggleWord($ele, data, index, isPerson) {
        $ele.css('opacity', '1');
    
        if ($ele.data('isName')) {
            let randomYear = isPerson ? Math.floor(Math.random() * (data.endYear - data.startYear + 1)) + data.startYear : data.year;
            $ele.text(randomYear);
            $ele.data('isName', false);
            $ele.data('randomYear', randomYear);
            $ele.addClass('yearElement');
            isElementActive = true;
            velocities[index] = { x: (Math.random() - 0.5) * slowedSpeed, y: (Math.random() - 0.5) * slowedSpeed };
    
            elements.forEach(function($otherEle) {
                if ($otherEle.data('isName')) {
                    let otherData = $otherEle.data();
                    if ((otherData.startYear <= randomYear && otherData.endYear >= randomYear) || 
                        (otherData.year === randomYear)) {
                        $otherEle.css('opacity', '1');
                    } else {
                        $otherEle.css('opacity', '0.5');
                    }
                }
            });
    
            isAnimating = false;
            $('body').removeClass('noYearActive');
        } else {
            $ele.text(data.name);
            $ele.data('isName', true);
            $ele.data('randomYear', null);
            $ele.removeClass('yearElement');
            isElementActive = false;
            velocities[index] = { x: (Math.random() - 0.5) * normalSpeed, y: (Math.random() - 0.5) * normalSpeed };
    
            // 检查是否有其他元素显示年份
            if (!elements.some($el => !$el.data('isName'))) {
                $('body').addClass('noYearActive');
            }
        }
    }
    

    function createElement(data, isPerson) {
        var pos = generateUniquePosition();
        positions.push(pos);

        var $element = $('<div>', {
            text: data.name,
            class: 'floatingText',
            css: {
                left: pos.x + 'px',
                top: pos.y + 'px'
            },
            data: isPerson ? { isName: true, startYear: data.startYear, endYear: data.endYear } : 
                             { isName: true, year: data.year }
        }).appendTo('body');

        $element.on('click', function() {
            if (!isElementActive || $(this).data('isName') === false) {
                toggleWord($(this), data, elements.indexOf($element), isPerson);
            }
        });

        elements.push($element);

        velocities.push({
            x: (Math.random() - 0.5) * normalSpeed,
            y: (Math.random() - 0.5) * normalSpeed
        });
    }

    peopleData.forEach(function(data) {
        createElement(data, true);
    });

    eventData.forEach(function(data) {
        createElement(data, false);
    });

// 添加这一行来初始化页面为无年份活动状态
$('body').addClass('noYearActive');

    $(document).on('click', function(event) {
        if (!$(event.target).closest('.floatingText').length && !isAnimating) {
            isAnimating = true;
        }
    });

    function update() {
        if (isAnimating) {
            elements.forEach(function($ele, index) {
                var velocity = velocities[index];
                var newPos = {
                    x: parseFloat($ele.css('left')) + velocity.x,
                    y: parseFloat($ele.css('top')) + velocity.y
                };

                if (newPos.x < 0 || newPos.x + $ele.outerWidth() > $(window).width()) {
                    velocity.x = -velocity.x;
                }
                if (newPos.y < 0 || newPos.y + $ele.outerHeight() > $(window).height()) {
                    velocity.y = -velocity.y;
                }

                $ele.css({left: newPos.x, top: newPos.y});
            });
        }
        requestAnimationFrame(update);
    }

    update();
});
