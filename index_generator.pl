#!/usr/bin/env perl

use strict;
use warnings;
use Carp;
use Template;

open(FILE, 'build/speedread-mini.js') || croak $!;
<FILE>;
my $speedread = join('', <FILE>);
$speedread =~ s/%/%25/g;
chomp $speedread;
close(FILE);

open(FILE, 'build/speedread-loader-mini.js') || croak $!;
my $speedread_loader = join('', <FILE>);
$speedread_loader =~ s/%/%25/g;
close(FILE);

my $template = Template->new();
$template->process('index_template.html', {speedread => $speedread, speedread_loader => $speedread_loader}) || croak $template->error();

