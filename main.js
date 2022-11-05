/**
 * Return Array of each note and its respective video name combined an array.
 * @param {Array} input Array of stripped TextContent and video names.
 * @returns Return Array of array with size 2 where 1st is video name and 2nd is a note.
 */
function getNotes(input) {
    // split at the duration.
    var result_list = input.split(/\d:\d\d/);
    var video_name = result_list[0];
    var unmodified_note = result_list.pop();

    // check if personal notes are included.
    if (unmodified_note.includes('Your Notes')) {
        // make sure to see personal notes.
        var modified_note = unmodified_note.replace('Your Notes', '\n ## YOUR NOTES ## \n');
        return new Array(video_name, modified_note);
    }
    return new Array(video_name, unmodified_note);
}


/**
 * Return Array of each note and its respective video name combined an array.
 * @param {String} i text content in each "li tag"
 * @returns Return Array of array with size 2 where 1st is video name and 2nd is a note.
 */
function arrayForming(i) {
    var stripped_text = stripping(i.textContent) + '\n';
    var result = getNotes(stripped_text);
    return result;
}


function stripping(msg) {
    return msg.replace("Go to video", '').replace('EditDelete', '');
}


/**
 * Return Array of each note and its respective video name combined an array.
 * @returns Return Array of array with size 2 where 1st is video name and 2nd is a note.
 */
function extractNotes() {
    var notes = document.querySelectorAll("li.css-qmttav");
    return Array.prototype.map.call(notes, arrayForming);
}


/**
 * Returns the array of array with size 2 where 1st is video name and 2nd is array of notes under that video.
 * @param {Array} extract_list Array of Arrays with size[2] where 1st is video name and 2nd is a note.
 * @returns Return array of combined notes under same video name. 
 */
function merge(extract_list) {
    let arr = [];
    extract_list.map((val, _, __) => {
        // find out the video name is same or not.
        var exists = arr.find(el => el[0] == val[0]);
        if (exists) {
            // append to existing notes.
            exists[1].push(val[1]);
        } else {
            // creating new array for new video name.
            arr.push([val[0], [val[1]]]);
        }
    });
    return arr;
}


/**
 * Returns a prettify string ready for the text file.
 * @param {Array} merged_list Nested list under same video name.
 * @returns Concatenated strings of merged_list values.
 */
function arrayToStr(merged_list) {
    let myStr = '';
    merged_list.forEach((val, _) => {
        myStr += val[0] + '\n';
        val[1].forEach(
            (in_val, index) => {
                // number of notes under same video.
                var cur_index = index + 1;
                if (cur_index == 1) {
                    // add adjust to have new line character at the start of the list.
                    myStr += '\n' + cur_index + '.' + ' ' + in_val;
                } else {

                    myStr += cur_index + '.' + ' ' + in_val;
                }
            }
        );
        myStr += '\n------------------------------------\n'
    });
    return myStr;
}


function saveFile(blob, filename) {
    var element = document.createElement('a');
    element.href = URL.createObjectURL(blob);
    element.setAttribute('download', filename);
    element.style.display = 'none';

    document.body.appendChild(element);
    element.click();

    document.body.removeChild(element);
}



function outputProcess() {

    // This is for autoclick See More Button.
    // const interval = setInterval(() => {
    //     console.log('it is clicking');
    //     const elements2 = document.querySelectorAll('button.cds-134.cds-105.cds-107.css-poju2t.cds-116.cds-button-disableElevation');
    //     if (elements2.length != 0) {
    //         elements2[0].click();
    //     } else {
    //         clearInterval(interval);
    //     }
    // }, 6000);



    let userConsent = confirm('Press OK to download. If all the notes want to be saved at once, click "See More Notes" button at the end of the notes page.');

    if (userConsent) {
        let myResultList = merge(extractNotes());
        let myResultStr = arrayToStr(myResultList);
        var myblob = new Blob([myResultStr], {
            type: 'text/plain'
        });
        saveFile(myblob, "result.txt",);
    }
}


outputProcess()
