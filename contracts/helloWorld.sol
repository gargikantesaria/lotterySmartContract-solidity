//Solidity Program written in Remix
pragma solidity >=0.4.17;

contract helloWorld{
    string public word;

    function helloWorld(string memory initialWord) public{
        word = initialWord;
    }

    function getWord() public view returns (string memory){
        return word;
    }

    function setWord(string memory givenWord) public{
        word = givenWord;
    }
}
