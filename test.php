<?php
        // Slot machine conversion for Crypto.Games
        
$server_seed = "ylVWazQHJxoG9TAcLmDj1n6q1UkJgyFW4oTJhUhL";
$client_seed = "sdf96dsf9876s9dd78f6";
$next_server_seed_hash = "bdfa300164ebbd77ce9a3c3c58863688c4537df91173088915afdd4c9b6b302c";
$reel_strip_array=array("Error","Apple","Banana","Cherry","Grapes","Strawberry","Orange","Coin","Peach");
$win_array=array(10000,1500,700,100,70,25,11,0);
$server_seed_hash=hash('sha256', $server_seed);
if ($server_seed_hash==$next_server_seed_hash)
{ echo "Server Seed match.\n"; }
else
{   
    echo "SERVER SEED MISMATCH!\n";
    echo "Server seed      =\t$server_seed\n";
    echo "Server seed Hash =\t$server_seed_hash\n";
    echo "Alleged next Hash=\t$next_server_seed_hash\n";
}
$reels_found=0;
$position=0;
$combined_seed = $server_seed.$client_seed;
echo "Combined seed = $combined_seed\n";
$combined_hash = hash('sha512', $combined_seed);
echo "Hash of combined seed = $combined_hash\n";
do
{
    $first_two=substr($combined_hash,$position,2);
    $hex_to_dec=hexdec($first_two)%10;
    if (($hex_to_dec>=1)&&($hex_to_dec<=8))
    {
        $reels_array[$reels_found] = $hex_to_dec;
        $reels_found++;
        echo "Reel $reels_found =\t$reel_strip_array[$hex_to_dec]\n";
    }
    $position+=2;
    if ($position==128)
    {
        echo "Error -- No more space in hash.\n";
        $reels_found=5;
    }
}
while ($reels_found<5);
$coins=0;
for ($i=0; $i<=4; $i++)
{
    if ($reels_array[$i]==7)
    {   $coins++;   }
}
if ($coins==5)
{   $win=0; }
elseif ( ($reels_array[0]==$reels_array[1]) && ($reels_array[0]==$reels_array[2]) && ($reels_array[0]==$reels_array[3]) && ($reels_array[0]==$reels_array[4]))
{   $win=1; } // five of a kind
elseif ($coins==4)
{   $win=2; }
elseif ((($reels_array[0]==$reels_array[1]) && ($reels_array[0]==$reels_array[2]) && ($reels_array[0]==$reels_array[3])) || 
        (($reels_array[0]==$reels_array[1]) && ($reels_array[0]==$reels_array[2]) && ($reels_array[0]==$reels_array[4])) || 
        (($reels_array[0]==$reels_array[1]) && ($reels_array[0]==$reels_array[3]) && ($reels_array[0]==$reels_array[4])) || 
        (($reels_array[0]==$reels_array[2]) && ($reels_array[0]==$reels_array[3]) && ($reels_array[0]==$reels_array[4])) || 
        (($reels_array[1]==$reels_array[2]) && ($reels_array[1]==$reels_array[3]) && ($reels_array[1]==$reels_array[4]))) 
{   $win=3; } // four of a kind
elseif ($coins==3)
{   $win=4; }
elseif ($coins==2)
{   $win=5; }
elseif ($coins==1)
{   $win=6; }
else
{   $win=7; }
echo "Win    =\t$win_array[$win]\n"

// Procedure
// 1.  Step the "position" to 0 and "reels found" to 0.
// 2.  Join server and client seed and server seed, in that order. 
// 3.  Generate a SHA-512 hash of the string from step 2.
// 4.  Convert first two characters, starting at the "position" of the hash from step 3 from hexidecimal to decimal.
// 5.  Take the terminal digit from from 4. 
// 6.  If the result from step 5 is 1 to 8, then, map it to a symbol, according to the table below, and increment "reels found" by 1.
// 7.  If five reels have been found, then stop, otherwise increment the "position" by 1 and go back to step 4.
// 8.  After five reels have been found, display them from left to right, in order that they were found in the Hash.
// 9.  Symbol map:
//     1 = Apple
//     2 = Banana
//     3 = Cherry
//     4 = Grapes
//     5 = Strawberry
//     6 = Orange
//     7 = Coin
//     8 = Peach
?>