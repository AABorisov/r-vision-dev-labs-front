const text = `
        page 1 of 29© 2020 <ORG>Cisco</ORG>. All rights reserved. talos-external@cisco.com  |  talosintelligence.com

        The art and science
        of detecting <MALWARE>Cobalt Strike</MALWARE>
        BY <IDENTITY>NICK MAVIS</IDENTITY>

        EDITED BY <IDENTITY>JOE MARSHALL</IDENTITY> AND <IDENTITY>JON MUNSHAW</IDENTITY>

        Updated <TIMESTAMP>September 11, 2020</TIMESTAMP>

        https://twitter.com/nickmavis


        page 2 of 29© 2020 <ORG>Cisco</ORG>. All rights reserved. talos-external@Cisco.com  |  talosintelligence.com

        The art and science of detecting <MALWARE>Cobalt Strike</MALWARE>

        TABLE OF CONTENTS
        Introduction ................................................................................................................................................................................ 3

        Getting up to speed .................................................................................................................................................................... 3

        Listeners ........................................................................................................................................................................... 3

        Web management ............................................................................................................................................................. 4

        Reporting .......................................................................................................................................................................... 5

        Attack analysis ........................................................................................................................................................................... 5

        Target Module: Raw Shellcode generator ......................................................................................................................... 5

        Execution .......................................................................................................................................................................... 5

        Detection .......................................................................................................................................................................... 7

        Target module: Staged/stageless executable generator ................................................................................................... 8

        C2 Communication ......................................................................................................................................................... 10

        Target Module: HTML application attack generator ........................................................................................................ 13

        Target Module: Scripted web delivery ............................................................................................................................. 16

        Target Module: Signed Java Applet Attack ..................................................................................................................... 17

        Target Module: Smart Java Applet Attack ....................................................................................................................... 18

        Target module: System profiler ....................................................................................................................................... 24

        Conclusion ................................................................................................................................................................................ 26

        Appendix A: Coverage.............................................................................................................................................................. 27

        Staged/Stageless Executables ....................................................................................................................................... 27

        Scripted Web Delivery <SOFTWARE>PowerShell</SOFTWARE> .................................................................................................................................. 27

        Beacon Binary Payloads .................................................................................................................................................. 27

        Beacon <SOFTWARE>PowerShell</SOFTWARE> payloads .......................................................................................................................................... 27

        HTML Application (HTA) Attacks ..................................................................................................................................... 27

        <MALWARE>Cobalt Strike</MALWARE> signed applet attack .................................................................................................................................. 28

        <MALWARE>Cobalt Strike</MALWARE> smart applet attack .................................................................................................................................... 28

        <MALWARE>Cobalt Strike</MALWARE> system profiler attack ................................................................................................................................ 28



        page 3 of 29© 2020 <ORG>Cisco</ORG>. All rights reserved. talos-external@cisco.com  |  talosintelligence.com

        The art and science of detecting <MALWARE>Cobalt Strike</MALWARE>

        INTRODUCTION
        <MALWARE>Cobalt Strike</MALWARE> is ubiquitous in the cyber security arena. It’s
        a prolific toolkit used at many levels of intrusion to solve
        adversaries' problems like post-intrusion exploitation,
        beaconing for command and control (C2s), stealth and
        reconnaissance.

        <MALWARE>Cobalt Strike</MALWARE> is a modularized attack framework: Each
        module fulfills a specific function and stands alone. It’s hard
        to detect, because its components might be customized
        derivatives from another module, new, or completely
        absent. Malicious actors find <MALWARE>Cobalt Strike</MALWARE>’s obfuscation
        techniques and robust tools for C2, stealth and data
        exfiltration particularly attractive.

        <ORG>Cisco</ORG> Talos recently updated its <SOFTWARE>SNORT</SOFTWARE>® and <SOFTWARE>ClamAV</SOFTWARE>®
        signatures to detect <MALWARE>Cobalt Strike</MALWARE>, version 4.0, a common
        platform utilized as one part of attack processes. This
        paper outlines the challenges we were confronted with
        when analyzing <MALWARE>Cobalt Strike</MALWARE>, and the ways we crafted our
        detection. We will address all the modules we’ve updated
        coverage for, how we analyzed and thought about detection
        and the signature that resulted.

        GETTING UP TO SPEED
        <MALWARE>Cobalt Strike</MALWARE> is a paid penetration-testing tool that anyone
        can use. Malicious actors have used it for years to deploy
        “Listeners” on victim machines. In this paper, we’ll dive into
        some of the core components of <MALWARE>Cobalt Strike</MALWARE> and then
        break down our analysis of these components and how we
        can protect against them. We will also look at <MALWARE>Cobalt Strike</MALWARE>
        from the adversary’s perspective.

        LISTENERS

        Listeners are at the core of <MALWARE>Cobalt Strike</MALWARE>. They allow
        adversaries to configure the C2 method used in an attack.
        Every attack or payload generated in <MALWARE>Cobalt Strike</MALWARE> requires
        the targeted user to select a Listener to embed within
        it. This will determine how an infected host will reach
        out to the C2 server to retrieve additional payloads and
        instructions.

        When creating a listener, the user can configure the payload
        type, name, C2 server and port, and other various options
        such as named pipes or proxy servers (Figure 1). Users can
        choose from:

        • Beacon DNS

        • Beacon HTTP

        • Beacon HTTPS

        • Beacon SMB

        • Beacon TCP

        • External C2

        • Foreign HTTP

        • Foriegn HTTPS

        Potentially the most powerful aspect of <MALWARE>Cobalt Strike</MALWARE> is
        the array of malleable C2 profiles, which allows users to
        configure how attacks are created, obfuscate and manage
        the flow of execution at a very low level.

        There are several ways to visualize how an adversary
        interacts with infected <MALWARE>Cobalt Strike</MALWARE> hosts, such as a
        session table, pivot graph, or a target table. In Figure 2,
        you can see the session table, along with some options
        available when selecting a host.

        Figure 1: <MALWARE>Cobalt Strike</MALWARE> Listener console



        page 4 of 29© 2020 Cisco. All rights reserved. talos-external@<ORG>Cisco</ORG>.com  |  talosintelligence.com

        The art and science of detecting <MALWARE>Cobalt Strike</MALWARE>

        However, this does not give insight into how the hosts are
        interconnected, nor the C2 path taken when contacting the
        <MALWARE>Cobalt Strike</MALWARE> C2. For that, we can swap to the Pivot Graph
        (Figure 3).

        In Figure 3, the \`WIN-498IQCJRIUQ\` host is connected through
        “DESKTOP-R8VN37V” and all C2 operations are executed
        using that path. Listeners that are designed only to connect
        infected hosts laterally include the SMB and TCP beacons.

        Attackers can also control hosts through the interactive beacon
        console. This allows for more advanced control of a host.

        WEB MANAGEMENT

        <MALWARE>Cobalt Strike</MALWARE> delivers exploits and/or malicious payloads
        using an attacker-controlled web server. The web server
        can be configured to perform the following actions:

        • Host files

        • Clone an existing website to trick users

        • Scripted web delivery

        • Signed Applet Attack (<SOFTWARE>Java</SOFTWARE>)

        • Smart Applet Attack (<SOFTWARE>Java</SOFTWARE>)

        • System profiling

        Figure 4 shows how an adversary would manage the
        “Sites” console from their end. In this example, we’re
        hosting a malicious <SOFTWARE>PowerShell</SOFTWARE> script on the ‘/malware’
        URI over port 80.

        You can also see that the HTTP based listeners are also
        present as they are used to deliver additional payloads and
        C2 commands to victims.

        When a victim reaches out to the <MALWARE>Cobalt Strike</MALWARE> web server,
        it’s logged for operators.

        Figure 2: <MALWARE>Cobalt Strike</MALWARE> session table

        Figure 4

        Figure 3: <MALWARE>Cobalt Strike</MALWARE> Pivot Table



        page 5 of 29© 2020 <ORG>Cisco</ORG>. All rights reserved. talos-external@cisco.com  |  talosintelligence.com

        The art and science of detecting <MALWARE>Cobalt Strike</MALWARE>

        REPORTING

        <MALWARE>Cobalt Strike</MALWARE> offers a variety of report generators to get a
        complete breakdown of the infected hosts and associated data.

        Available options include:

        • Activity report

        • Hosts report

        • Indicators of compromise

        • Sessions report

        • Social engineering report

        • Tactics, techniques and procedures

        ATTACK ANALYSIS

        TARGET MODULE: RAW SHELLCODE GENERATOR

        <MALWARE>Cobalt Strike</MALWARE> generates raw, malicious payloads that an
        attacker could implement into other attacks. The payload
        can be generated as raw shell code or preformatted in

        almost any language desired, including <SOFTWARE>PowerShell</SOFTWARE>, Python
        and <SOFTWARE>Java</SOFTWARE>, among many others. When generating raw
        payloads, the user is presented with only the HTTP, HTTPS
        and DNS beacons to choose from. The generated payload
        can act as a staging payload for the <MALWARE>Cobalt</MALWARE> beacon, to be
        plugged into an exploit of their choice.

        For analysis, we only concentrated on the x86 and x64
        binary payloads generated in C. No matter the code
        selected, the resulting payload isn’t designed to execute by
        itself. The generator’s primary function is to format the shell
        code in a way that allows the user to drop in a third-party
        exploit or custom exploits and have it preformatted in that
        particular programming language.

        Figure 5 shows a payload generated with the x86 HTTP listener.

        EXECUTION

        Since the payload is only a bunch of raw bytes, it won’t
        just run if a user double-clicked the file. The adversary
        would have to load the shellcode and jump to the desired
        entry point. This is trivial — we can use a quick C script that

        Figure 5: <MALWARE>Cobalt Strike</MALWARE> payload generated with x86 HTTP Listener.



        page 6 of 29© 2020 <ORG>Cisco</ORG>. All rights reserved. talos-external@cisco.com  |  talosintelligence.com

        The art and science of detecting <MALWARE>Cobalt Strike</MALWARE>

        loads the desired shellcode and then
        executes it as if it were a function.
        This enables defenders to quickly
        analyze shell code in some cases
        without having to perform any over-
        the-top attempts to load it (Figure 6).

        Once the buffer is allocated and
        called, we can see the start of the
        <MALWARE>Cobalt Strike</MALWARE> shellcode in Figure 7.

        It starts with a common shellcode
        instruction \`cld\`, which is used to
        make sure strings are processed
        from left to right by clearing the
        Direction Flag (DF). Then, we
        immediately call the first function to
        import “wininet.dll” (Figure 8).

        Immediately, we can see a string
        for “wininet”, and a four-byte hex
        value pushed onto the stack, and an
        indirect register call on \`ebp\`, which
        currently points to the first instruction
        after \`shellcode_main()\` [shellcode_
        main+0x6].

        The shellcode is unaware of the
        libraries it needs to execute and
        needs to import them. This technique
        is often used by malware to
        obfuscate calls to the <SOFTWARE>Windows API</SOFTWARE>
        by resolving imports using a hash of
        the function. This one, in particular,
        is a modified version of <TOOL>Metasploit</TOOL>'s
        “reverse_http” shellcode (Figure 9).

        Figure 10 shows a pointer to the
        Process Environment Block (PEB)
        and the PEB_LDR_DATA data
        structure within. This target is the
        \`InMemoryOrderModuleList,̀  which
        contains a list of all modules loaded
        in memory. By traversing this list,
        we can also get a list of functions
        available within each module. <MALWARE>Cobalt Strike</MALWARE> iterates over each DLL,
        converts the full name to lowercase
        and begins to calculate a hash
        value of each export using the full
        DLL name and the desired function

        Figure 6

        Figure 7

        Figure 8

        Figure 9

        https://en.wikipedia.org/wiki/Process_Environment_Block


        page 7 of 29© 2020 <ORG>Cisco</ORG>. All rights reserved. talos-external@cisco.com  |  talosintelligence.com

        The art and science of detecting <MALWARE>Cobalt Strike</MALWARE>

        name. The hashing algorithm used is
        a simple ROR13, the same one used
        by <TOOL>Metasploit</TOOL>.

        The retrieved DLL + Function name
        is compared to a calculated hash
        against the hex value (0x726774C)
        passed in earlier as an argument
        to \`call_by_hash()\`. If the match is
        successful, <MALWARE>Cobalt Strike</MALWARE> calls that
        function immediately with the other
        arguments passed.

        Figure 11 shows the relevant
        functionality from the <TOOL>Metasploit</TOOL>’s
        \`hash.py:̀

        The payload makes an outbound
        HTTP call to the configured HTTP
        C2 server.

        The <MALWARE>Cobalt Strike</MALWARE> C2 server responds
        with an HTTP 200 OK, containing a
        very large binary blob. This blob is
        the core functionality of <MALWARE>Cobalt Strike</MALWARE>,
        better known as “<IOC>beacon.dll</IOC>.” From
        here on out, this is the code that will
        be used to control an infected host.
        After retrieving the DLL, it is loaded
        via a technique called <MITRE_ATTACK>Reflective DLL injection</MITRE_ATTACK>.

        DETECTION

        Now that we have a good
        understanding of how a <MALWARE>Cobalt Strike</MALWARE> payload works, we can work
        on creating detection for these
        payloads. The goal when creating
        detection content is to cover
        something in its entirety, with the
        fewest rules, without triggering false
        positives. This, for the most part,
        ensures we are creating generic
        detection rather than something that
        only targets one thing. At Talos, we
        want our detection to catch variants
        and potential future threats.

        When looking into coverage for the
        <MALWARE>Cobalt Strike</MALWARE> payloads, we found we

        Figure 10

        Figure 11

        https://www.google.com/url?q=https://attack.mitre.org/techniques//001/&sa=D&ust=1596559074788000&usg=AFQjCNGxlDBHg3K-731T8ArLHwcCpVrVXQ
        https://www.google.com/url?q=https://attack.mitre.org/techniques//001/&sa=D&ust=1596559074788000&usg=AFQjCNGxlDBHg3K-731T8ArLHwcCpVrVXQ


        page 8 of 29© 2020 <ORG>Cisco</ORG>. All rights reserved. talos-external@cisco.com  |  talosintelligence.com

        The art and science of detecting <MALWARE>Cobalt Strike</MALWARE>

        had some prior coverage alerting on the payloads, including
        these <SOFTWARE>Snort</SOFTWARE> rules:

        • 1:15306:22

        • 1:11192:20

        • 1:30471:3

        • 1:30229:3

        The first two are generic file type detection rules that are
        the base for setting flowbits in <SOFTWARE>Snort</SOFTWARE> and can be ignored.
        However, SIDs 1:30471 and 1:30229 are <TOOL>Metasploit</TOOL>
        shellcode rules we released years ago that still apply here.

        At the time, these rules were suspected to be false positive
        prone and were not enabled by default in policy. We can’t
        narrow them down to a specific type or protocol. Therefore,
        we have to remove a lot of checks that tell <SOFTWARE>Snort</SOFTWARE> whether or
        not to inspect a packet further and re-enabled them.

        The key element here is the <SOFTWARE>Snort</SOFTWARE> header, \`alert tcp any
        any -> any any\`. Most <SOFTWARE>Snort</SOFTWARE> rules will declare a traffic
        direction (coming from or going to the user’s network)
        and the applicable port ranges. Since this raw shellcode
        can be used with potentially any exploit over an unknown
        protocol or port, we can’t narrow it down to inspection on
        for example just port 80. We also don’t know if a host is
        compromised already and attempting to move laterally, so
        we can’t specify the source and destination networks. This
        means that <SOFTWARE>Snort</SOFTWARE> will attempt to match this particular byte
        sequence on all TCP traffic crossing the sensor. Not only
        is this undesirable for performance reasons, it heightens
        the potential for false positives. We need to be a little more
        cautious when releasing a catch-all rule such as this.

        The following <SOFTWARE>Snort</SOFTWARE> rule also helped in detecting reverse
        shell sessions from <TOOL>Metasploit</TOOL>

        • [1:30480:3]  INDICATOR-SHELLCODE <TOOL>Metasploit</TOOL> pay-
        load windows_x64_meterpreter_reverse_https

        After analyzing the preexisting <SOFTWARE>Snort</SOFTWARE> rules, the only thing
        left to cover is the outbound HTTP request and the binary
        blob <MALWARE>Cobalt Strike</MALWARE> retrieves from the C2 server. Typically,
        covering the initial outbound HTTP GET would be ideal
        since we want to identify potential C2 traffic as fast as
        possible and flag the host as compromised in <ORG>Cisco</ORG>
        Firepower NGFW. However, the URI code we used in our
        research could be anything and was always random in
        samples. The HTTP Header fields were also unhelpful, since
        there wasn’t anything unique enough to distinguish the
        request apart from benign traffic. This leaves us with only

        the HTTP response containing the binary blob.

        The shellcode started similarly to the raw payload with a
        \`cld\` instruction followed by a short function designed to
        decrypt the rest of the payload with an operator configured
        XOR key.

        Since we don’t want to target encrypted data with our
        detection, we used the start of the shellcode as the
        detection target. This resulted in two new rules, both
        looking for the same thing across different listeners.

        • [1:53757:1]  MALWARE-OTHER <MALWARE>CobaltStrike</MALWARE> <IOC>beacon.dll</IOC>
        download attempt

        • [1:53758:1]  MALWARE-OTHER <MALWARE>CobaltStrike</MALWARE> <IOC>beacon.dll</IOC>
        download attempt

        TARGET MODULE: STAGED/STAGELESS EXECUTABLE
        GENERATOR

        This module will encompass both staged and stageless
        <MALWARE>Cobalt Strike</MALWARE> <MALWARE>beacons</MALWARE>. This is the core component
        delivered to a victim host and establishes persistence, C2
        communication, and any further execution on the host.
        <MALWARE>Beacons</MALWARE> are extremely versatile and expose a huge number
        of features for operators.

        Staged vs. Stageless

        Stageless payloads are delivered to the victim all at once.
        Typically, a stageless payload already contains a large
        variety of malicious functionality and will not require
        additional resources to infect the victim.

        Staged payloads are usually small, malicious payloads
        that are used to load a larger, more robust payload. This
        allows an attacker to transfer a small binary to a targeted
        host and retrieve the desired payload afterward. Stagers
        are designed to be as small as possible so that they can
        be delivered using different techniques and leave less of a
        footprint.

        Having a smaller initial payload with less functionality
        is more likely to evade AV detection by appearing to be
        benign. A stager can then grab the larger payload for more
        functionality and load it directly into memory.

        Stagers allow adversaries to embed your payloads in
        different methods. An adversary could take staged code and
        send it in an exploit with resource limitations on the target.



        page 9 of 29© 2020 <ORG>Cisco</ORG>. All rights reserved. talos-external@cisco.com  |  talosintelligence.com

        The art and science of detecting <MALWARE>Cobalt Strike</MALWARE>

        <MALWARE>Beacon</MALWARE> options

        Generating a <MALWARE>beacon</MALWARE> payload can
        result in a few different types of
        executable files — each of them
        embedded with a Listener and
        architecture of your choice. This will
        generate an \`<IOC>artifact.exe</IOC>\` file to save
        on disk. How it’s used from there is
        up to the operator.

        • Raw (Stageless only)

        • Windows EXE

        • Windows Service EXE

        • Windows DLL (32 bit)

        • Windows DLL (64 bit)

        Staged

        After startup, <MALWARE>Cobalt Strike</MALWARE> spawns a
        new thread designed to construct a
        named pipe for further execution. For
        the purposes of research, we opted
        to utilize a 32 bit executable with a
        reverse HTTP listener.

        Figure 12 shows a format string that
        calls to \`sprintf()\` with the default
        structure of the named pipe. The
        four-digit number is a randomly
        generated number but we can see
        that in a default configuration, the
        name has a static structure like
        “<IOC>\\\\\\\\.\\\\pipe\\\\MSSE-6722-server.</IOC>”

        Following thread creation, the
        named pipe is created and a
        connection is initiated. The goal of
        this is to process additional shellcode
        embedded within the binary by
        writing it to the named pipe thread.

        This pipe is decrypted using a rolling
        XOR against the data. The default
        XOR key for this particular payload
        is 0xE3F4C314. After decryption is
        complete, another thread is created
        that immediately jumps to and
        executes the shellcode (Figure 13).

        Figure 12

        Figure 13



        page 10 of 29© 2020 <ORG>Cisco</ORG>. All rights reserved. talos-external@cisco.com  |  talosintelligence.com

        The art and science of detecting <MALWARE>Cobalt Strike</MALWARE>

        Stageless

        Stageless operates in the same way a staged payload
        does — it still spawns a named pipe and data needs to
        be decrypted just like a staged payload. This payload in
        particular is larger than 200KB.

        However, once the final payload is decoded, it needs to be
        loaded into memory. This is performed using a technique
        called <MITRE_ATTACK>Reflective DLL loading</MITRE_ATTACK> — the process of loading a
        library from memory into a host process.

        An executable needs to access various resources to
        function correctly. It needs to know its base address in
        memory and have valid headers and a fully built import
        address table. This is how an executable knows where to
        call functions such as LoadLibrary or GetProcAddress.

        Once the reflective loader has rebuilt the necessary sections
        and relocated the image, we’ll see the actual path of execution.

        Once we unpack <IOC>beacon.dll</IOC>, we can dump it to disk and see
        the final artifact.

        <MALWARE>Beacon</MALWARE> configuration

        <MALWARE>Cobalt Strike</MALWARE> configuration is marked in the executable by
        patterns that allow us to parse it directly out of an unpacked
        <MALWARE>beacon</MALWARE> DLL. The configuration is XOR encrypted, but by
        default, use a static XOR key for each respective <MALWARE>beacon</MALWARE>
        version (3 or 4).

        Figure 14 shows a decrypted <MALWARE>Cobalt Strike</MALWARE> configuration
        from the unpacked <MALWARE>Cobalt Beacon</MALWARE>.

        C2 COMMUNICATION

        Heartbeat

        An infected host will reach out to the <MALWARE>Cobalt Strike</MALWARE> C2
        server periodically with a heartbeat, sending basic
        metadata back home and gathering any commands issued
        by an operator. When a command is requested to be
        executed on the host, it’s queued up and waits for that host
        to reach out.

        Figure 14

        https://www.exploit-db.com/docs/english/13007-reflective-dll-injection.pdf
        https://www.exploit-db.com/docs/english/13007-reflective-dll-injection.pdf


        page 11 of 29© 2020 <ORG>Cisco</ORG>. All rights reserved. talos-external@cisco.com  |  talosintelligence.com

        The art and science of detecting <MALWARE>Cobalt Strike</MALWARE>

        Figure 15 shows the heartbeat.

        It looks pretty benign, but all the metadata is stored in the
        HTTP cookie. We can’t simply gain access to that data by
        base64-decoding the cookie, since <MALWARE>Cobalt Strike</MALWARE> heartbeat
        data is encrypted. <MALWARE>Cobalt Strike</MALWARE> uses RSA with PKCS1
        padding to encrypt the data prior to sending it back home.

        Talos researchers extracted the private/public key
        directly from the teamserver running on a virtual machine,
        something that wouldn’t be possible outside of an isolated
        research environment.

        Tasks

        Now that we understand the heartbeats, let’s look at
        the exchange for tasking a <MALWARE><MALWARE>beacon</MALWARE></MALWARE>. When a task is not
        available, the server will respond with another encrypted

        payload in the HTTP 200 OK (Figure 16).

        When configured, the response payload is an encrypted
        task. <MALWARE>Cobalt Strike</MALWARE> uses AES-256 in CBC mode with HMAC-
        SHA-256 to encrypt task commands. The AES key can
        be found in the <MALWARE>beacon</MALWARE> metadata we decrypted earlier.
        It is calculated using the first 16 bytes of the decrypted
        metadata.

        Callbacks

        After execution, the host calls back to the C2 server.
        This time, the default configuration was an HTTP POST
        containing another encrypted payload (Figure 17).

        The first four bytes are the size of the encrypted payload so
        we skip those when decrypting.

        Figure 15

        Figure 16

        Figure 17



        page 12 of 29© 2020 <ORG>Cisco</ORG>. All rights reserved. talos-external@cisco.com  |  talosintelligence.com

        The art and science of detecting <MALWARE>Cobalt Strike</MALWARE>

        The structure of the data observed is:

        • 4 bytes - Counter

        • 4 bytes - Data Size

        • 4 bytes - Type of callback

        • Variable - Data

        Figure 18 is a decrypted Process List callback.

        Detection

        Based on these actions, we wanted to write detection
        that would catch a <MALWARE>Cobalt Strike</MALWARE> stager being downloaded
        before it can target anything else. Catching the stager is
        pivotal, as it is most likely to prevent infection. Once the
        stager traverses into memory, it reflectively loads the final
        <MALWARE>beacon</MALWARE> payload and becomes harder to deal with.

        Researchers first generated every variant possible and
        created PCAPs of the stager traversing over typical ports
        seen in file-data traversal.

        Once again, we triggered the <TOOL>Metasploit</TOOL> shellcode rules for
        every payload when we checked prior coverage:

        • 1:30229 INDICATOR-SHELLCODE <TOOL>Metasploit</TOOL> windows/
        shell stage transfer attempt

        • 1:30471 INDICATOR-SHELLCODE <TOOL>Metasploit</TOOL> payload
        windows_adduser

        • 1:30480 INDICATOR-SHELLCODE INDICATOR-SHELL-
        CODE <TOOL>Metasploit</TOOL> payload windows_x64_meterpret-
        er_reverse_https

        Since we confirmed these rules provide coverage, we can
        move onto the core stageless <MALWARE>beacon</MALWARE>.

        The approach here was to once again find a unique set
        of instructions that can be associated with <MALWARE>Cobalt Strike</MALWARE>
        <MALWARE>beacons</MALWARE> while avoiding false positives. It was pretty difficult
        to find a good match in the stageless <MALWARE>beacons</MALWARE>, but the
        function in Figure 19 sparked our interest.

        This function is pretty simple — its purpose is to parse the
        DOS header and check for the correct file magic signature.

        Figure 18

        Figure 19: A function
        inside a stageless <MALWARE>Cobalt Strike</MALWARE> <MALWARE>beacon</MALWARE>.



        page 13 of 29© 2020 <ORG>Cisco</ORG>. All rights reserved. talos-external@cisco.com  |  talosintelligence.com

        The art and science of detecting <MALWARE>Cobalt Strike</MALWARE>

        If it exists, it jumps to the IMAGE_NT_OPTIONAL header
        and checks the magic there.

        After comparison, the AL byte is set to reflect the correct
        architecture. This is used for further processing of the
        file header. A quick run in <SOFTWARE>Snort</SOFTWARE> showed that this alerted
        on every single <MALWARE>beacon</MALWARE> we generated. This doesn’t look
        malicious on the surface, so researchers ran this function
        with multiple preceding NOPs through false-positive
        testing. Expectations were not high, but we couldn’t find a
        single false positive. This wasn’t the case prior to adding in
        the extra alignment bytes. Either NOP was less commonly
        used for alignment in modern compilers, or we were
        extremely lucky. Regardless, we had performed enough
        due diligence in testing to give the rule a shot.

        The result was four rules that are still going strong to this day.

        • 1:53656 MALWARE-OTHER <MALWARE>Cobalt Strike</MALWARE> x86 execut-
        able download attempt

        • 1:53657 MALWARE-OTHER <MALWARE>Cobalt Strike</MALWARE> x86 execut-
        able download attempt

        • 1:53658 MALWARE-OTHER <MALWARE>Cobalt Strike</MALWARE> x64 execut-
        able download attempt

        • 1:53659 MALWARE-OTHER <MALWARE>Cobalt Strike</MALWARE> x64 execut-
        able download attempt

        TARGET MODULE: HTML APPLICATION ATTACK
        GENERATOR

        The focus of this attack generator is to generate an HTML
        Application (HTA), a file extension for the HTML executable
        file format and typically consists of HTML/Dynamic HTML
        and a scripting language of choice. HTA files behave like
        executables. They are popular among attackers because
        they run as a fully trusted application in certain cases.

        When using the HTML Application Attack generator the user
        can select a <MALWARE>Cobalt Strike</MALWARE> listener as usual and the method,
        including executable, <SOFTWARE>PowerShell</SOFTWARE> and <SOFTWARE>VBA</SOFTWARE>.

        These methods do not determine the scripting language
        used in the HTA files. In all methods, VBScript is used to
        deliver the desired payload in the HTA file. The method,
        however, changes the payload type and how it is executed
        on the host. Let’s take a look at each of them.

        Executable

        The executable method (Figure 20) is a straightforward

        attack, as it is simply designed to load a large ASCII hex
        string and execute it on the host.

        The shellcode is loaded by creating a \`Scripting.
        FileSystemOjbect\` and using that to create a temporary
        file on the host. After initializing the temporary file, the
        shellcode stream is converted from hex string to bytes and
        written to the file (Figure 18).

        Finally, the file is executed using a WScript.Shell object and
        the temporary file and folder are deleted to cover its tracks
        (Figure 21).

        <SOFTWARE>PowerShell</SOFTWARE>

        The <SOFTWARE>PowerShell</SOFTWARE> method is relatively naive at first glance,
        as it once again uses the WScript.Shell object to invoke
        <SOFTWARE>PowerShell</SOFTWARE>. This time, rather than creating a temporary
        executable file, it simply runs <SOFTWARE>powershell</SOFTWARE> with a large
        base64-encoded command (Figure 22).

        We base64 decode the command, which results in a
        unicode string containing additional <SOFTWARE>PowerShell</SOFTWARE> and another
        base64 blob. Here, we can start to see the desired path to

        Figure 22

        Figure 20

        Figure 21



        page 14 of 29© 2020 <ORG>Cisco</ORG>. All rights reserved. talos-external@cisco.com  |  talosintelligence.com

        The art and science of detecting <SOFTWARE><MALWARE>Cobalt Strike</MALWARE></SOFTWARE>

        infection, as it takes the second base64 blob and is creating
        an \`IO.MemoryStream\` object out of it. A quick look at the
        resulting code shows that we, once again, jumped the gun
        in analysis and it’s gzip compressed.

        We can quickly decompress the extracted data on the CLI
        (Figure 23).

        The newly decoded payload declares some new functions.

        • \`func_get_proc_address()\`

        • \`func_get_delegate_type()\`

        This is a fairly old technique (around 2012) that allows
        the user to invoke calls via .NET native method wrappers
        in <SOFTWARE>PowerShell</SOFTWARE>. This allows the user to call the <SOFTWARE>Windows API</SOFTWARE> using and execute code in a fileless manner via the
        \`System.Reflection\` namespace.

        We can then use\`GetMethod()\` to acquire a handle to the
        desired functionality and bypass any restrictions. The goal
        in this payload is to expose the \`GetProcAddress\` library
        function so that we can load the desired <SOFTWARE>Windows API</SOFTWARE> code
        and interact with it.

        System.Reflection exposes another function called
        \`GetDeletegateForFunctionPointer\`. Using this, <MALWARE>Cobalt Strike</MALWARE> grabs a function pointer to any API function it needs
        for execution.

        Once an executable section of memory is allocated and

        populated.. <MALWARE>Cobalt Strike</MALWARE> can then execute the payload
        in memory through another delegate defined for the
        memory region.

        So what is the base64 string this time? It’s shell code, but
        actually XOR encrypted (Figure 24).

        This is pretty easy to decrypt. We know that it’s XOR’d using
        the key 0x23 (35) so we can decode this using our method of
        choice. In this case, we used \`xortool-xor̀  (Figure 25)

        Eventually, we determined that this is the same code as
        seen in the raw payload section in different packaging.
        Once <MALWARE>Cobalt Strike</MALWARE> gets it right, it reuses that work across
        other attack options. This makes it more convenient for
        defenders to write detection.

        Figure 23

        Figure 24

        Figure 25

        https://docs.microsoft.com/en-us/dotnet/api/system.reflection


        page 15 of 29© 2020 <ORG>Cisco</ORG>. All rights reserved. talos-external@cisco.com  |  talosintelligence.com

        The art and science of detecting <MALWARE>Cobalt Strike</MALWARE>

        <SOFTWARE>VBA</SOFTWARE>

        The <SOFTWARE>VBA</SOFTWARE> Method gives a little bit of a different approach
        (Figure 26).

        So far, we’ve seen basic methods of loading binary code
        and executing it. In this method, we can see that it uses an
        Excel Workbook to execute additional code. The first thing
        that happens is <MALWARE>Cobalt Strike</MALWARE> loads up an \`Excel.Application\`
        and then queries a registry key:

        \`HKEY_CURRENT_USER\\Software\\Microsoft\\
        Office\\<Excel Version>\\Excel\\Security\\AccessVBOM\\̀

        This key is a security setting for restricting default
        programmatic access to the Office VB project. If it’s
        enabled, Office will trust all macros and run any code
        without a security warning or additional permissions from
        the user. <MALWARE>Cobalt Strike</MALWARE> attempts to flip that switch and

        disable this protection in the registry.

        After that, <MALWARE>Cobalt Strike</MALWARE> once again calls the <SOFTWARE>Windows API</SOFTWARE>
        to execute binary code. Then, it allocates an executable
        section of memory within the process and runs it by calling
        \`kernel32.dll!CreateRemoteThread\`.

        Detection

        This type of multilayer obfuscation is easy to extract when
        in hand but can be extremely effective against security
        products that don’t know it’s coming. But it’s possible to
        work around this.

        For the executable method, the shellcode was actually the
        same assembly code as what we discussed earlier in the
        Staged/Stageless Executables. The NOP-based function is
        interpreted as a hex string, so we can clone those rules to

        Figure 26



        page 16 of 29© 2020 <ORG>Cisco</ORG>. All rights reserved. talos-external@cisco.com  |  talosintelligence.com

        The art and science of detecting <MALWARE>Cobalt Strike</MALWARE>

        match a hex string, rather than actual bytes.

        • 1:54110 MALWARE-OTHER <MALWARE>Html.Trojan.CobaltStrike</MALWARE>
        HTML <MALWARE>beacon</MALWARE> download attempt

        • 1:54111 MALWARE-OTHER <MALWARE>Html.Trojan.CobaltStrike</MALWARE>
        HTML <MALWARE>beacon</MALWARE> download attempt

        • 1:54112 MALWARE-OTHER <MALWARE>Html.Trojan.CobaltStrike</MALWARE>
        HTML <MALWARE>beacon</MALWARE> download attempt

        • 1:54113 MALWARE-OTHER <MALWARE>Html.Trojan.CobaltStrike</MALWARE>
        HTML <MALWARE>beacon</MALWARE> download attempt

        For the <SOFTWARE>PowerShell</SOFTWARE> method, we have again a ton of
        obfuscated code underneath it, so the coverage should
        target generic function calls. For this, we went with the
        <SOFTWARE>PowerShell</SOFTWARE> command arguments, and supplemented that
        with matching on a Wscript.Shell object being created.

        • 1:54114 MALWARE-OTHER <MALWARE>Html.Trojan.CobaltStrike</MALWARE>
        <SOFTWARE>powershell</SOFTWARE> payload download attempt

        • 1:54115 MALWARE-OTHER <MALWARE>Html.Trojan.CobaltStrike</MALWARE>
        <SOFTWARE>powershell</SOFTWARE> payload download attempt

        Lastly, we have the <SOFTWARE>VBA</SOFTWARE> Method. Our researchers found
        this easy to cover because HTA files don’t often interface
        with Excel workbooks, let alone one that tinkers with the
        “AccessVBOM” registry key.

        • 1:54116 MALWARE-OTHER <MALWARE>Html.Trojan.CobaltStrike</MALWARE>
        <SOFTWARE>VBA</SOFTWARE> payload download attempt

        • 1:54117 MALWARE-OTHER <MALWARE>Html.Trojan.CobaltStrike</MALWARE>
        <SOFTWARE>VBA</SOFTWARE> payload download attempt

        From there, we cloned all that to <SOFTWARE>ClamAV</SOFTWARE> coverage to get
        the following signatures:

        • <MALWARE>Html.Trojan.CobaltStrike</MALWARE>-7932561-0

        • <MALWARE>Html.Trojan.CobaltStrike</MALWARE>-7932562-0

        • <MALWARE>Html.Trojan.CobaltStrike</MALWARE>-7932563-0

        • <MALWARE>Html.Trojan.CobaltStrike</MALWARE>-7932564-0

        TARGET MODULE: SCRIPTED WEB DELIVERY

        In <MALWARE>Cobalt Strike</MALWARE>, there’s a feature called “scripted web
        delivery.” Executing a scripted web delivery attack simply
        means that you pick one of the <MALWARE>Cobalt Strike</MALWARE> payloads/
        listeners and <MALWARE>Cobalt Strike</MALWARE> will then host that payload at
        a user-configured URI. These can be generated in three
        different languages: <SOFTWARE>Bitsadmin</SOFTWARE>, <SOFTWARE>PowerShell</SOFTWARE> and <SOFTWARE>Python</SOFTWARE>.

        After hosting the payload, <MALWARE>Cobalt Strike</MALWARE> provides a

        command that can be executed, in the language of choice,
        that reaches out and grabs the malicious payload from an
        attacker-controlled web server and executes it.

        We are only going to concentrate on the <SOFTWARE>PowerShell</SOFTWARE>
        implementation, as it is the most commonly used module.
        The initial execution is using a web client to download an
        additional <SOFTWARE>PowerShell</SOFTWARE> payload from the attacker controlled
        web server and then continue to execute that code.

        Payload

        After reaching out to grab the real payload, we get a huge
        obfuscated <SOFTWARE>PowerShell</SOFTWARE> script from the web server, almost
        200KB in size.

        This script contained code reuse from the HTA module,
        but we still needed to go one layer deeper and verify the
        shellcode was unique in this module. We base64-decode
        the data and decrypt it using the same \`0x23\` default
        XOR key — and it’s already much larger than the previous
        payload.

        It’s not raw shellcode like we saw in the HTA payloads,
        you can immediately see that the “MZ” header is present.
        This seems to be a stageless <MALWARE>beacon</MALWARE> included in the
        <SOFTWARE>PowerShell</SOFTWARE> script. You might wonder why it wasn’t
        included in the HTA attack. The reason is the HTA module
        is executing a <SOFTWARE>PowerShell</SOFTWARE> one-liner and Windows has
        a character limit on command line strings, 32767. That
        number is even lower when executing a command from
        \`cmd.exe\`, 8191. The character limit varies across a variety
        of execution methods and these numbers are not always
        going to be correct.

        Since this payload is downloaded using a small one-liner to
        execute a string retrieved from the <MALWARE>Cobalt Strike</MALWARE> controlled
        server, that limit is bypassed and a more reliable payload
        can be provided.

        Detection

        To detect something, we first have to narrow down what
        we can actually see in <SOFTWARE>Snort</SOFTWARE> or <SOFTWARE>ClamAV</SOFTWARE>. We are not able
        to deobfuscate a <SOFTWARE>PowerShell</SOFTWARE> script coming across the
        network prior to detection — it’s simply not feasible without
        introducing latency for the client in most cases.

        So, for detection, we are left with the initial obfuscated
        payload downloaded. That’s not so bad because <MALWARE>Cobalt Strike</MALWARE>, in its current configuration, once again has a



        page 17 of 29© 2020 <ORG>Cisco</ORG>. All rights reserved. talos-external@cisco.com  |  talosintelligence.com

        The art and science of detecting <MALWARE>Cobalt Strike</MALWARE>

        static format when generating the <SOFTWARE>PowerShell</SOFTWARE> script.
        We know that in this instance, the code \`New-Object
        IO.MemoryStream(,[Convert]:: FromBase64String(\` following
        will always be present in a position relatively close to the
        start of the file.

        This gives us simple, but efficient, coverage using

        • 1:53973 MALWARE-OTHER <MALWARE>CobaltStrike</MALWARE> <SOFTWARE>PowerShell</SOFTWARE>
        web delivery attempt

        • 1:53974 MALWARE-OTHER <MALWARE>CobaltStrike</MALWARE> <SOFTWARE>PowerShell</SOFTWARE>
        web delivery attempt

        TARGET MODULE: SIGNED <TECHNIQUE>JAVA APPLET ATTACK</TECHNIQUE>

        The applets in this attack are self-signed, giving users
        limited options: a listener (per usual), port, local host and
        the URI it’s hosted on. This will spawn a hosted <SOFTWARE>Java</SOFTWARE> Applet
        on a malicious <MALWARE>Cobalt Strike</MALWARE> web server to infect users. If a
        user gives an applet permission to run, infection will occur.

        Landing Page

        Upon visiting the page, the user sees a generic landing
        page that loads a malicious JAR file, “<IOC>cross_platformi9.jar</IOC>”
        and applet class loaded is defined by the “code” parameter,
        “Java.class” (Figure 27).

        The first thing that catches the eye is that two parameters
        are passed — “id,” which contains a large base64 blob, and
        “type” which is set to “theme.” We can confirm this right off
        the bat by comparing the length of the raw HTTP <MALWARE>beacon</MALWARE>
        payload against the length of the decoded binary blob, both
        a total of 799 bytes.

        A second HTTP GET request is made for the JAR file during
        the process of loading this applet. So that’s the next step.

        Java archive (JAR)

        First, we’ll look at the JAR file (Figure 28).

        We have a few classes, and two DLLs named “main.dll”
        and “main64.dll”. You can also see the default signature file

        Figure 27

        Figure 28



        page 18 of 29© 2020 <ORG>Cisco</ORG>. All rights reserved. talos-external@cisco.com  |  talosintelligence.com

        The art and science of detecting <MALWARE>Cobalt Strike</MALWARE>

        (MYKEY.SF) and RSA certificate (MYKEY.RSA) used to sign
        the binary. Figure 29 shows us jusing jadx to decompile the
        source code.

        The base code called “Java.class” isn’t complicated — it’s
        an extension of “Applet” designed to spawn a thread. And
        the Base64.dll class isn’t malicious, it handles base64 as
        expected.

        “Main.class” is fairly basic but shows us that a temporary
        file is created, named “main.dll” and writes data to that
        file from either the main64.dll or main.dll file contained in
        the JAR file based on the system architecture. The system
        property “sun.arch.data.model” is a simple method to return
        the system’s word size, easily determining the architecture.
        Following this, the new DLL file path is fed to \`System.
        load()\`.

        <MALWARE>Cobalt Strike</MALWARE> uses the <SOFTWARE>Java Native Interface</SOFTWARE> (<SOFTWARE>JNI</SOFTWARE>) to perform
        injection. This is essentially the same as creating bindings
        to another program. It allows users to load a library into the
        <SOFTWARE>Java Virtual Machine</SOFTWARE> (<SOFTWARE>JVM</SOFTWARE>) and interact with it.

        Main.dll

        Since inject() is called from the <SOFTWARE>JNI</SOFTWARE> with the shellcode blob,
        we can load this into IDA and see an exposed function —
        J̀ava_Main_inject()\`.

        The handoff to J̀ava_Main_inject\` isn’t as straightforward as
        it would be passing a byte/character array in <SOFTWARE>C/C++</SOFTWARE>. In this
        case the exported function looks a little like Figure 30:

        The data is extracted from the <SOFTWARE>JNI</SOFTWARE> objects and then passed
        to the real \`inject()\` function that spawns a new thread and
        resumes execution in the shellcode passed in from the “id”
        parameter.

        Detection

        We need to isolate the things we want to cover and
        separate them from each other when evaluating multiple

        levels of execution. Here, we can identify a few things.

        1. The landing page that spawns the malicious applet

        2. The JAR file

        3. main.dll/main64.dll

        The landing page was fairly simple, as we already identified
        that the parameter is simply the raw payload from earlier.
        The JAR files contain the same DLL 32/64 bit and code
        every time but have a different name. This simplifies things
        as we target what we know is malicious in there.

        The last thing was the extracted DLL, and our prior work
        paid off. We had prior coverage available from various x32/
        x64 download rules we created researching the staged/
        stageless beacons.

        TARGET MODULE: SMART JAVA APPLET ATTACK

        The Smart Java Applet Attack is very similar to Signed Applets
        in execution. Instead of just running raw shell code, though, it
        attempts to gain execution through various Java exploits. It is
        deemed “Smart” as it determines what exploit to use based
        on the version of Java the victim host is running.

        Landing Page

        The landing page is for the most part the same as Signed
        Applet Attacks. It spawns a malicious page on the default
        URI, “/SiteLoader.”

        Once again, there’s a base64 blob containing the “id”

        Figure 29

        Figure 30



        page 19 of 29© 2020 <ORG>Cisco</ORG>. All rights reserved. talos-external@cisco.com  |  talosintelligence.com

        The art and science of detecting <MALWARE>Cobalt Strike</MALWARE>

        parameter and a “type” parameter
        with the value “os.” The payload is
        slightly different, however, since it
        uses the same shellcode stub. We
        already know what this does for
        the most part, so we’ll skip further
        analysis.

        Java Archive

        Per the <MALWARE>Cobalt Strike</MALWARE> official
        documentation, we can get a brief
        understanding of this module’s goal.

        • The smart applet analyzes its
        environment and decides which
        Java exploit to use. If the Java
        version is vulnerable, the applet
        will disable the security sandbox,
        and spawn a session using <MALWARE>Cobalt Strike</MALWARE>’s Java injector.

        • These exploits in this attack work
        against Java 1.7u21 and older.
        Java 1.6u45 and older is also
        vulnerable to this attack.

        The exploits used are not specified
        however, we know it affects the Java
        versions shown in Figure 31. Since
        we don’t know what exploits it’s
        using already, we must look closer.

        There are a lot more classes shown
        in Figure 32, but we can see that
        main.dll/main64.dll are still included.
        A quick \`sha256sum\` reveals that
        these are the same DLLs included
        in the Signed Applet Attack module.
        We once again can decompile the jar
        using \`jadx\` as we did in the Signed
        Applet Attack. The decompilation
        was not clean as we receive one
        error for an unknown instruction,
        “invoke-polymorphic”. This
        instruction is not currently supported
        in jadx, so we will just ignore it for
        now and start looking at J̀avaApplet.
        class\` in Figure 31.

        This class directs execution based on

        Figure 31

        Figure 32

        the version of Java installed, here we can identify how it targets each version. The
        code polls “java.version” via a call to System.getProperty to get the JRE version
        installed, if any. Following that it is matched against the PCRE \`1.(\\d+).0_(\\d+)\`. The
        important thing with this PCRE is that it has two capture groups that retrieve major
        and minor Java versions for further processing. It’s important to understand the
        structure of Java version strings. [See https://www.oracle.com/java/technologies/
        javase/versioning-naming.html].

        "1.<Major Version>.0_<Update Release>"

          When the version string for the product is reported as “java version 1.8.0_5”, the
          product will be called <SOFTWARE>JDK 8u5</SOFTWARE>, <SOFTWARE>JDK 8</SOFTWARE> update 5 or, when the update version is not

          https://www.oracle.com/java/technologies/javase/versioning-naming.html
          https://www.oracle.com/java/technologies/javase/versioning-naming.html


          page 20 of 29© 2020 <ORG>Cisco</ORG>. All rights reserved. talos-external@cisco.com  |  talosintelligence.com

          The art and science of detecting <MALWARE>Cobalt Strike</MALWARE>

          important, <SOFTWARE>JDK 8</SOFTWARE>.

          We discovered this module exploits multiple vulnerabilities.
          The <SOFTWARE>Java</SOFTWARE> execution flow is as follows:

          • <= Java 6u27 -> \`Rhino()\`

          • <= Java 6u45 -> \`AppIcon()\`

            • == Java 7u0 -> \`Rhino()\`

            • <= Java 7u6 -> \`Exec()\`

          • <= Java 7u21 -> \`Bean()\`

            If the regex fails and the version string is equal to “1.7.0”
            also direct execution to \`Rhino()\`

            Main.java

            Main.java contains the same code as we saw in the Signed
            Applet attack. Its sole purpose is to run main.dll, or main64.
            dll, with the shellcode provided in the “id” parameter by
            interfacing with the <SOFTWARE>JNI</SOFTWARE>. We will touch on how this works a

            bit in the next section.

          <CVE>CVE-2011-3544</CVE> - <SOFTWARE>Oracle</SOFTWARE> <SOFTWARE>Java</SOFTWARE> applet rhino script engine
            remote code execution

          <SOFTWARE>Java</SOFTWARE> Version <= 1.6.0_27 or <SOFTWARE>Java</SOFTWARE> Version == 7.0

          This class is associated with the <SOFTWARE>Rhino</SOFTWARE> Script Engine which
          is used to run arbitrary code outside of the <SOFTWARE>Java</SOFTWARE> sandbox.

          This was dangerous at one point in time because these
          <SOFTWARE>JavaScript</SOFTWARE> objects were not controlled by the <SOFTWARE>Java</SOFTWARE>
          SecurityManager. Protections were put in place to limit
          attempts to execution however it was determined that you
          bypass the sandbox limitations by storing <SOFTWARE>Java</SOFTWARE> code in a
          string and then executing it. When executing the \`toString()\`
          method, it returns a <SOFTWARE>Java</SOFTWARE> function in the context of the caller
          (Figure 33).

          So if we are restricted by the permissions of the caller,
          we are still limited in execution privileges. Instead, we

          Figure 33



          page 21 of 29© 2020 <ORG>Cisco</ORG>. All rights reserved. talos-external@cisco.com  |  talosintelligence.com

          The art and science of detecting <MALWARE>Cobalt Strike</MALWARE>

          need to generate an error object containing the code as
          its message. This module extends the Main class. When
          spawning a thread of itself, it will look to see if the class
          implemented \`Runnable\` and the \`run()\` function, which
          \`Main\` does. This means that the goal is to spawn main.dll
          with desired shellcode but from outside the sandbox.

          <CVE>CVE 2013-2465</CVE> - <SOFTWARE>Oracle</SOFTWARE> <SOFTWARE>Java</SOFTWARE> 2D ImagingLib remote
          code execution

          <SOFTWARE>Java</SOFTWARE> Version <= 1.6.0_45

                  This vulnerability exploits a vulnerability when filtering()
          BufferedImage’s using \`AffineTransformOp\`.

          First, some necessary helper classes are defined
                  to assert certain behavior later down the road,
          “ComponentColorModel” and “ICC_ColorSpace” (Figure 34).

          Figure 35 shows a defined ColorComponentModel that

                  is supplied to the \`BufferedImage\` constructor to fool a
                  specific check within \`storeImageArray()\`. That check is
                  for \`(hintP->packing == BYTE_INTERLEAVED)\`. When this
          check succeeds, data is written back to the destination.
          The second class defines a ComponentColorModel
          that will always return \`True\` when calling
          \`isCompatibleRaster()\`.

          Now to prepare an exploit, we move to \`loadIcon()\`. First,
          we need to prepare the necessary objects for execution.
          The order of the following allocations is extremely
          important as we want them to be aligned in memory
          (Figure 35).

          To get a better understanding of Java access control security.
          A \`Statement̀  object can represent arbitrary method calls.
          When an instance of \`Statement̀  is created, the current
          security context is stored in \`Statement.acc .̀ When calling
          \`execute()̀  on that statement, <SOFTWARE>Java</SOFTWARE> attempts to verify that the

          Figure 34

          Figure 35



          page 22 of 29© 2020 <ORG>Cisco</ORG>. All rights reserved. talos-external@cisco.com  |  talosintelligence.com

          The art and science of detecting <MALWARE>Cobalt Strike</MALWARE>

          permissions surrounding that call have
          not been changed by looking at the
          value of \`Statement.acc .̀ Therefore
          the goal of this exploit is to gain the
          correct permissions on \`System.
          setSecurityManager()̀  to disable it by
          overwriting it’s \`AccessControlContext̀ .
          To prepare for that, a new
          \`Permissions̀  object is created with
          \`AllPermission()̀  (Figure 36).

          Now, comes <CVE>CVE-2013-2465</CVE>
          (Figure 37).

          Two \`BufferedImagè  are created. The
          second uses the dataBufferByte[]
          object we declared earlier. A raster
          is created with a \`dataBitOffset\`
          that points outside of the
          \`dataBufferByte[16]\` memory structure.
          <MALWARE>CobaltStrike</MALWARE> then sets the first pixel to
          \`0xFFFFFFFF .̀ Finally, the vulnerable
          storeImageArray() call through filter()
          is performed and data is written back
          to the object and corrupts the adjacent
          object’s length.

          <MALWARE>Cobalt Strike</MALWARE> can now loop
          through \`iArr[]\` until it finds the
          default \`Statement.acc\` field and
          overwrite it with the \`AllPermission\`
          object created earlier. Now,
          \`setSecurityManger\` can be executed
          with the necessary permissions to
          disable it and run shellcode.

          <CVE>CVE-2012-4681</CVE>  - <SOFTWARE>Oracle</SOFTWARE> <SOFTWARE>Java 7</SOFTWARE>
          SunToolkit Remote Code Execution

          <SOFTWARE>Java</SOFTWARE> Version <= 1.7.0_6

                  This vulnerability exploits the <SOFTWARE>Java</SOFTWARE>
        \`Class.forName()\` or \`ClassFinder\` to
        gain access to private object fields.
        In the context of <MALWARE>CobaltStrike</MALWARE>, this
        resolves around calls to \`SetField()\`
        from \`sun.awt.SunToolkit\`. Originally
        in <SOFTWARE>Java 6</SOFTWARE>, this was not possible as we
        weren’t allowed to gain a reference
        to \`sun.awt.SunToolkit\`. In <SOFTWARE>Java 7.0_6</SOFTWARE>,
        this changed and introduced <CVE>CVE-2012-4681</CVE>.

        There are three main methods to this class.

        • \`check()\`

        • \`SetField()\`

        • \`GetClass()\`

        Check() is the first function executed in the exploit and the execution path is
        pretty simple. As we saw in <CVE>CVE-2013-2465</CVE>, a Statement object is created for
        \`setSecurityManager()\`, along with a new permissions object.

        The next operation is a call to \`sf()\`, short for \`SetField()\`, private class method
        with the statement class type, the desired field “acc”, our Statement object,
        and the new permissions we want. \`Sun.awt.SunToolkit\` is a restricted class
        for untrusted code, normally you wouldn’t be able to gain access in our current
        security context.



        page 23 of 29© 2020 <ORG>Cisco</ORG>. All rights reserved. talos-external@cisco.com  |  talosintelligence.com

        The art and science of detecting <MALWARE>Cobalt Strike</MALWARE>

        An adversary could exploit this vulnerability by calling
        \`Class.forName()\` as the target method of the Expression. In
        reality, \`forName()\` is not called. Instead, \`Expression\` uses
        custom logic to load classes without verifying permissions.
        Without \`Expression\`, this would not be possible.

        After returning to \`SetField()\` with our privileged class
        access, the second issue is exploited to gain access to
        a private field. An adversary could go on to disable the
        security manager and execute arbitrary shellcode.

        <CVE>CVE-2013-2460</CVE> - <SOFTWARE>Oracle</SOFTWARE> <SOFTWARE>Java</SOFTWARE> ProviderSkeleton invoke()
        remote code execution

        <SOFTWARE>Java</SOFTWARE> Version <= 1.7.0_21

                      This exploit involves gaining access to a restricted package
                      through a public interface.

                      This exploit can be found in:

        •  Bean

        •  BeanHelper

        •  BeanProvider

                      The \`com.sun.tracing.Provider\` and \`java.lang.reflect.
                      InvocationHandler\` are the main culprits here. This gives
                      access to a \`Provider\` interface, or \`ProviderSkeleton\`, and
                      provides the base for the target \`invoke()\` function.

                      This starts obtaining a lookup method by creating an
                      Invocationhandler via \` java.lang.reflect.Proxy\`. From there,
        the exploit can obtain a reference to \`MethodHandles.
                      lookup\` and call it via the InvocationHanlder defined earlier.

                      This is most of the work needed to begin exploitation, access
                      to the \`invoke()̀  method is already provided. But how does
                      that give an attacker an opportunity to elevate privileges? The
                      invoke method, in <SOFTWARE>Java 7u21</SOFTWARE>, does not perform any checks on
        whether or not a public method should be accessible by the
        calling class. See the openjdk commit in Figure 38.

        The second issue is that in this case, \`invoke()̀  does not
        return the calling blass but instead returns \`sun.tracing.
        ProviderSkeletoǹ . This all comes together because
        \`ProviderSkeletoǹ  is a privileged class. Eventually, <MALWARE>Cobalt Strike</MALWARE>
        loads several classes and, once again, disables the manager.

        <MALWARE>Cobalt Strike</MALWARE> now uses the \`displayAd()\` (Figure 39) to make
        calls to invoke() and return privileged classes that they
        would otherwise not have access to.

        You can see another call to \`getMethod()\` prior to invoking
        the argument, this function is used to obtain access to the
        familiar \`forName()\` method. Then once again like earlier, that
        can be called to gain access to restricted classes (Figure 40).

        Figure 38

        Figure 39

        Figure 40



        page 24 of 29© 2020 <ORG>Cisco</ORG>. All rights reserved. talos-external@cisco.com  |  talosintelligence.com

        The art and science of detecting <MALWARE>Cobalt Strike</MALWARE>

        Next, three restricted classes are loaded:

        • \`sun.org.mozilla.javascript.internal.Context\`

        • \`sun.org.mozilla.javascript.internal.DefiningClassLoader\`

        • \`sun.org.mozilla.javascript.internal.GeneratedClassLoader\`

        This is now used to load the \`BeanHelper()\` class included
        with the Smart Applet and execute it under a privileged
        context by calling \`AccessController.doPrivileged()’, as
        shown in Figure 41.

        And the security manager is disabled... again.

        Detection

        The amount of devices running <SOFTWARE>Java</SOFTWARE> is astoundingly
        high still in 2020. It still continues to be a widely used
        language and commonly installed utility for users. These
        vulnerabilities are pretty old, but for the Smart Applet to be
        effective, the amount of vulnerable devices is likely still high
        enough to warrant them being included.

        Now, detection here was the easiest part. Remember
        how the landing page was extremely similar to the Signed
        Applet module? Additionally, main.dll/main64.dll is again
        included in the Smart Applet JAR. We already covered it
        with the same detection. Case closed on some old <SOFTWARE>Java</SOFTWARE>
        vulnerabilities with prior coverage.

        TARGET MODULE: SYSTEM PROFILER

        This module is designed to perform reconnaissance on
        systems visiting a <MALWARE>Cobalt Strike</MALWARE>-controlled web server. It is
        important to note that this module is not intended to infect a
        host, but rather supply information on the operating system
        and applications installed on a target.

        Payload

        When an operator configures the system profiler, there are
        two options for gathering the desired information. The first
        one utilizes a large <SOFTWARE>JavaScript</SOFTWARE> file that leverages multiple
        <SOFTWARE>ActiveX</SOFTWARE> controls to gather information. The second is an
        optional <SOFTWARE>Java</SOFTWARE> Applet, a common theme we’ve seen in
        <MALWARE>Cobalt Strike</MALWARE>, to supply additional information on top of the
        JS. The final configuration option is a redirect. This makes
        the victim client redirect to another page after performing
        profiling the system.

        The initial landing page for the system profiler delivers a
        page with code similar to Figure 42:

        Let’s glance over both types for a high-level overview.

        <SOFTWARE>Java</SOFTWARE> Applet

        The initial landing page checks to see if <SOFTWARE>Java</SOFTWARE> is installed and
        enabled in two different ways. First, it uses \`deployJava.
        geJREs()\` to return an array of installed versions, or an
        empty array if not present. The second is \`navigator.

        Figure 41

        Figure 42



        page 25 of 29© 2020 <ORG>Cisco</ORG>. All rights reserved. talos-external@cisco.com  |  talosintelligence.com

        The art and science of detecting <MALWARE>Cobalt Strike</MALWARE>

        javaEnabled()\` which is a simple boolean "True" or "False".

        <SOFTWARE>Java</SOFTWARE> is installed if either check succeeds. The <SOFTWARE>Java</SOFTWARE> Applet,
        “iecheck.class,” runs on the page, as shown in Figure 43.

        The class contains a small code base that only has two
        functions. One is designed to return the version of <SOFTWARE>Java</SOFTWARE>,
        the client is running. The other is a little more tricky and is
        geared toward exposing the internal IP address of the client.

        <SOFTWARE>JavaScript</SOFTWARE>

        The <SOFTWARE>JavaScript</SOFTWARE> is the bulk of the profiler and a huge file
        weighing in at over 200KB and almost 5,000 lines of code
        (after beautifying it). It checks browser versions, system
        information and installed applications through <SOFTWARE>JavaScript</SOFTWARE>
        and <SOFTWARE>ActiveX</SOFTWARE> calls.

        Some of the checks include but are not limited to web
        browser, operating system, Adobe Acrobat, Adobe Flash
        and more. It also includes another attempt to get the
        internal IP address of the client, just like the <SOFTWARE>Java</SOFTWARE> Applet.

        Detection

        Detection here is pretty straightforward. Since the profiler
        is trying to do so much at once, we can make quick work on
        the landing page by checking HTTP responses.

        We want to look for any abnormal combination of
        application version checks by using <SOFTWARE>ActiveX</SOFTWARE> control class
        IDs and object names, static version checks, and attempts
        to load a Java applet. We can also look for attempts to
        store data within a 1x1 (width x height) element named
        \`checkip\`.

        Figure 43

        Figure 44



        page 26 of 29© 2020 <ORG>Cisco</ORG>. All rights reserved. talos-external@cisco.com  |  talosintelligence.com

        The art and science of detecting <MALWARE>Cobalt Strike</MALWARE>

        Generally speaking, it’s the easiest way to catch
        communication in the response from the client. At the end
        of the “check.js” file, we see an attempt to make an HTTP
        POST request back to the server with whatever information
        was collected (Figure 44).

        We can see that the client data section of the HTTP
        post contains the parameters and values sent to the
        \`application()\` function.

        This left us with the following detection:

        <SOFTWARE>Snort</SOFTWARE>

        • 1:13913 BROWSER-PLUGINS AcroPDF.PDF <SOFTWARE>ActiveX</SOFTWARE>
        clsid access attempt

        • 1:23878 BROWSER-PLUGINS <SOFTWARE>Oracle</SOFTWARE> <SOFTWARE>JRE</SOFTWARE> Deployment
        Toolkit <SOFTWARE>ActiveX</SOFTWARE> clsid access attempt

        • 1:38038 POLICY-OTHER PDF <SOFTWARE>ActiveX</SOFTWARE> CLSID access
        detected

        • 1:54180 MALWARE-OTHER <MALWARE>Cobalt Strike</MALWARE> system profil-
        ing attempt

        • 1:54181 MALWARE-OTHER <MALWARE>Cobalt Strike</MALWARE> system profil-
        ing attempt

        • 1:54182 MALWARE-OTHER <MALWARE>Cobalt Strike</MALWARE> system profil-
        ing attempt

        <SOFTWARE>ClamAV</SOFTWARE>

        • <MALWARE>Java.Malware.CobaltStrike-8008971-0</MALWARE>

        CONCLUSION
        This is an in-depth view into the <MALWARE>Cobalt Strike</MALWARE> attack
        framework, how Talos researchers analyzed each module
        and the struggles, breakdowns, victories, and detection that
        came along with it.

        The research performed resulted in more than 50
        signatures between <SOFTWARE>Snort</SOFTWARE> and <SOFTWARE>ClamAV</SOFTWARE> combined, covering
        over 400 <MALWARE>Cobalt Strike</MALWARE> samples.

        It’s important to note that the resulting detection based on
        this research project is intended to provide robust coverage
        for <MALWARE>Cobalt Strike</MALWARE> at its core, but is by no means exhaustive.
        Large-scale attack frameworks are always evolving,
        especially highly funded ones such as <MALWARE>Cobalt Strike</MALWARE>.

        Researchers must target what each security product does
        well and use that to their advantage. With that, you also
        have to know where its weaknesses lie. Having a good



        page 27 of 29© 2020 <ORG>Cisco</ORG>. All rights reserved. talos-external@cisco.com  |  talosintelligence.com

        The art and science of detecting <MALWARE>Cobalt Strike</MALWARE>

        understanding of the strengths and weaknesses in <SOFTWARE>Snort</SOFTWARE> or
        <SOFTWARE>ClamAV</SOFTWARE> is key to developing good generic detection.

        Does this mean we have covered <MALWARE>Cobalt Strike</MALWARE> in its entirety
        and it’s forever dead in the eyes of Talos? No. Does it mean
        we have provided what we believe to be a reasonably high
        level of detection to stop <MALWARE>Cobalt Strike</MALWARE> in its current form?
        Most definitely.



        page 28 of 29© 2020 Cisco. All rights reserved. talos-external@<ORG>Cisco</ORG>.com  |  talosintelligence.com

        The art and science of detecting <MALWARE>Cobalt Strike</MALWARE>

        APPENDIX A: COVERAGE

        STAGED/STAGELESS EXECUTABLES

        <SOFTWARE>Snort</SOFTWARE>

        • 1:53656 MALWARE-OTHER <MALWARE>Cobalt Strike</MALWARE> x86
        executable download attempt

        • 1:53657 MALWARE-OTHER <MALWARE>Cobalt Strike</MALWARE> x86
        executable download attempt

        • 1:53658 MALWARE-OTHER <MALWARE>Cobalt Strike</MALWARE> x64
        executable download attempt

        • 1:53659 MALWARE-OTHER <MALWARE>Cobalt Strike</MALWARE> x64
        executable download attempt

        <SOFTWARE>ClamAV</SOFTWARE>

        • \`<MALWARE>Win.Trojan.CobaltStrike-7899871-1</MALWARE>

        • \`<MALWARE>Win.Trojan.CobaltStrike-7899872-1</MALWARE>

        SCRIPTED WEB DELIVERY <SOFTWARE>PowerShell</SOFTWARE>

        <SOFTWARE>Snort</SOFTWARE>

        • 1:45907 MALWARE-CNC <MALWARE>Cobalt Strike</MALWARE> DNS beacon
        outbound TXT record **(UPDATED)**

        • 1:45908 MALWARE-CNC <MALWARE>Cobalt Strike</MALWARE> DNS beacon
        inbound TXT record **(UPDATED)**

        • 1:53972 MALWARE-OTHER <MALWARE>CobaltStrike</MALWARE> <IOC>beacon.dll</IOC>
        DNS download attempt

        • 1:53973 MALWARE-OTHER <MALWARE>CobaltStrike</MALWARE> <SOFTWARE>powerShell</SOFTWARE>
        web delivery attempt

        • 1:53974 MALWARE-OTHER <MALWARE>CobaltStrike</MALWARE> <SOFTWARE>powerShell</SOFTWARE>
        web delivery attempt

        • 1:53975 INDICATOR-COMPROMISE <MALWARE>CobaltStrike</MALWARE>
        multiple large DNS TXT query responses

        <SOFTWARE>ClamAV</SOFTWARE>

        • \`<MALWARE>Win.Trojan.Meterpreter-7385375-0</MALWARE>\`

        BEACON BINARY PAYLOADS

        <SOFTWARE>Snort</SOFTWARE>

        • 1:30229 INDICATOR-SHELLCODE <TOOL>Metasploit</TOOL> windows/
        shell stage transfer attempt **(UPDATED)**

        • 1:30471 INDICATOR-SHELLCODE <TOOL>Metasploit</TOOL> payload
        windows_adduser **(UPDATED)**

        • 1:30480 INDICATOR-SHELLCODE INDICATOR-
        SHELLCODE <TOOL>Metasploit</TOOL> payload windows_x64_
        meterpreter_reverse_https **(UPDATED)**

        • 1:53757 MALWARE-OTHER <MALWARE>CobaltStrike</MALWARE> <IOC>beacon.dll</IOC>
        download attempt

        • 1:53758 MALWARE-OTHER <MALWARE>CobaltStrike</MALWARE> <IOC>beacon.dll</IOC>
        download attempt

        <SOFTWARE>ClamAV</SOFTWARE>

        • <MALWARE>Win.Trojan.MSShellcode-5</MALWARE>

        • <MALWARE>Win.Trojan.CobaltStrike-7913051-0</MALWARE>

        BEACON <SOFTWARE>POWERSHELL</SOFTWARE> PAYLOADS

        <SOFTWARE>Snort</SOFTWARE>

        • 1:54095 MALWARE-OTHER <MALWARE>Win.Trojan.CobaltStrike</MALWARE>
        <SOFTWARE>powershell</SOFTWARE> beacon download attempt

        • 1:54096 MALWARE-OTHER <MALWARE>Win.Trojan.CobaltStrike</MALWARE>
        <SOFTWARE>powershell</SOFTWARE> beacon download attempt

        <SOFTWARE>ClamAV</SOFTWARE>

        • <MALWARE>Win.Trojan.CobaltStrike-7917400-0</MALWARE>

        HTML APPLICATION (HTA) ATTACKS

        <SOFTWARE>Snort</SOFTWARE>

        • 1:8068 BROWSER-PLUGINS Microsoft Windows
        Scripting Host Shell <SOFTWARE>ActiveX</SOFTWARE> function call access

        • 1:54110 MALWARE-OTHER <MALWARE>Html.Trojan.CobaltStrike</MALWARE>
        HTML payload download attempt

        • 1:54111 MALWARE-OTHER <MALWARE>Html.Trojan.CobaltStrike</MALWARE>



        page 29 of 29© 2020 <ORG>Cisco</ORG>. All rights reserved. talos-external@cisco.com  |  talosintelligence.com

        The art and science of detecting <MALWARE>Cobalt Strike</MALWARE>

        HTML payload download attempt

        • 1:54112 MALWARE-OTHER <MALWARE>Html.Trojan.CobaltStrike</MALWARE>
        HTML payload download attempt

        • 1:54113 MALWARE-OTHER <MALWARE>Html.Trojan.CobaltStrike</MALWARE>
        HTML payload download attempt

        • 1:54114 MALWARE-OTHER <MALWARE>Html.Trojan.CobaltStrike</MALWARE>
        <SOFTWARE>powershell</SOFTWARE> payload download attempt

        • 1:54115 MALWARE-OTHER <MALWARE>Html.Trojan.CobaltStrike</MALWARE>
        <SOFTWARE>powershell</SOFTWARE> payload download attempt

        • 1:54116 MALWARE-OTHER <MALWARE>Html.Trojan.CobaltStrike</MALWARE>
        <SOFTWARE>VBA</SOFTWARE> payload download attempt

        • 1:54117 MALWARE-OTHER <MALWARE>Html.Trojan.CobaltStrike</MALWARE>
        <SOFTWARE>VBA</SOFTWARE> payload download attempt

        <SOFTWARE>ClamAV</SOFTWARE>

        • <MALWARE>Html.Trojan.CobaltStrike</MALWARE>-7932561-0

        • <MALWARE>Html.Trojan.CobaltStrike</MALWARE>-7932562-0

        • <MALWARE>Html.Trojan.CobaltStrike</MALWARE>-7932563-0

        • <MALWARE>Html.Trojan.CobaltStrike</MALWARE>-7932564-0

        <MALWARE>Cobalt Strike</MALWARE> SIGNED APPLET ATTACK

        <SOFTWARE>Snort</SOFTWARE>

        • 1:54169 MALWARE-OTHER <MALWARE>Cobalt Strike</MALWARE> signed java
        applet execution attempt

        • 1:54170 MALWARE-OTHER <MALWARE>Cobalt Strike</MALWARE> signed java
        applet execution attempt

        • 1:54171 MALWARE-OTHER <MALWARE>Cobalt Strike</MALWARE> signed java
        applet download attempt

        • 1:54172 MALWARE-OTHER <MALWARE>Cobalt Strike</MALWARE> signed java
        applet download attempt

        • 1:54173 MALWARE-OTHER <MALWARE>Cobalt Strike</MALWARE> signed java
        applet download attempt

        • 1:54174 MALWARE-OTHER <MALWARE>Cobalt Strike</MALWARE> signed java
        applet download attempt

        • 1:54175 INDICATOR-COMPROMISE <MALWARE>Cobalt Strike</MALWARE>
        default signed applet attack URI

        <SOFTWARE>ClamAV</SOFTWARE>

        • <MALWARE>Win.Trojan.CobaltStrike-8001474-0</MALWARE>

        • <MALWARE>Win.Trojan.CobaltStrike-8001477-1</MALWARE>

        <MALWARE>Cobalt Strike</MALWARE> SMART APPLET ATTACK

        <SOFTWARE>Snort</SOFTWARE>

        • 1:54183 INDICATOR-COMPROMISE <MALWARE>Cobalt Strike</MALWARE>
        default smart applet attack URI

        <SOFTWARE>ClamAV</SOFTWARE>

        • Prior coverage signed applet submissions

        <MALWARE>Cobalt Strike</MALWARE> SYSTEM PROFILER ATTACK

        <SOFTWARE>Snort</SOFTWARE>

        • 1:13913 BROWSER-PLUGINS AcroPDF.PDF <SOFTWARE>ActiveX</SOFTWARE>
        clsid access attempt **MAX DETECT**

        • 1:23878 BROWSER-PLUGINS <SOFTWARE>Oracle</SOFTWARE> <SOFTWARE>JRE</SOFTWARE> Deployment
        Toolkit <SOFTWARE>ActiveX</SOFTWARE> clsid access attempt **MAX DETECT**

        • 1:38038 POLICY-OTHER PDF <SOFTWARE>ActiveX</SOFTWARE> CLSID access
        detected **MAX DETECT**

        • 1:54180 MALWARE-OTHER <MALWARE>Cobalt Strike</MALWARE> system
        profiling attempt

        • 1:54181 MALWARE-OTHER <MALWARE>Cobalt Strike</MALWARE> system
        profiling attempt

        • 1:54182 MALWARE-OTHER <MALWARE>Cobalt Strike</MALWARE> system
        profiling attempt

        <SOFTWARE>ClamAV</SOFTWARE>

        • <MALWARE>Java.Malware.CobaltStrike-8008971-0</MALWARE>


        _fc5rziddqgfm
        _go2hv7ut784o
        _qf4jzftqnybl
        _1qukxsq0ft7l
        _j01c68rrkg1u
        _od77ioq0wcos
        _99ipmbl5celg
        _hfs1usdxyh4q
        _cd17e2cwur1j
        _wbmtaibalv70
        _ren4cj59lkps
        _z3idehsuoshh
        _u199v83bpgtu
        _9537z5lypnzt
        _dk6mdna6g3am
        _9onk0sobghz5
        _40yzzo1drv0j
        _71pcrxn6pqo0
        _lmdby71vme0l
        _dr9wgt4h9yv
        _1qc071i18p5g
        _bt0uo0xsnyxv
        _9jsukqkbp8ct
        _5xrbjztz2tfl
        _q86ltopafa1r
        _jl3vd2ktm2sb
        _f4q8adum2g4k
        _au0nhiun7ui8
        _gtdk8sa8pm4a
        _mb1iulmw5jzo
        _pdomcyx7hsnz
        _tvg24jel73pr
        _hc4d7tbfgmqo
        _u3q6qgudx3a
        _xnduwtwc8hoo
        _sjtpuuzd1m6t
        _gujeu0mh0ejn
        _fh0lzq5v1djb
        _idtxk3bsd6v1
        _ytkhdgc0lizh
        _8d2fhov2yn72
        _cuj3lrz5r3dh
        _dpq8rwkq5xnr
        _lv2ush8ssa9j
        _kgzwzc5u78ie
        _euerz6s41u3v
        _cjbnbda00hp1
        _hqoedzuzj41a`;

export default text;
